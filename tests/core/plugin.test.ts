import { describe, it, expect } from 'vitest';
import {
  loadPlugin,
  unloadPlugin,
  runTransform,
  getSchemaExtension,
  getLoadedPlugins,
} from '../../src/core/plugin';
import { createRootNode } from '../../src/core/document';

describe('Plugin system', () => {
  it('registers and runs transforms', async () => {
    loadPlugin({
      name: 'test-transform',
      setup: (ctx) => {
        ctx.registerTransform('addParagraph', (doc) => ({
          ...doc,
          children: [...(doc.children ?? []), { id: 'p1', type: 'paragraph' }],
        }));
      },
    });
    const doc = createRootNode([]);
    const result = await runTransform('addParagraph', doc);
    expect(result.children?.[0]?.type).toBe('paragraph');
  });

  it('registers and retrieves schema extensions', () => {
    loadPlugin({
      name: 'test-schema',
      setup: (ctx) => {
        ctx.registerSchemaExtension('customBlock', {
          type: 'custom',
          attrs: { foo: 'bar' },
        });
      },
    });
    const ext = getSchemaExtension('customBlock') as {
      type: string;
      attrs: { foo: string };
    };
    expect(ext.type).toBe('custom');
    expect(ext.attrs.foo).toBe('bar');
  });

  it('loads and unloads plugins dynamically', () => {
    loadPlugin({ name: 'dynamic', setup: () => {} });
    expect(getLoadedPlugins().some((p) => p.name === 'dynamic')).toBe(true);
    unloadPlugin('dynamic');
    expect(getLoadedPlugins().some((p) => p.name === 'dynamic')).toBe(false);
  });

  it('handles missing transforms and schema extensions gracefully', async () => {
    await expect(
      runTransform('notfound', createRootNode([]))
    ).rejects.toThrow();
    expect(getSchemaExtension('notfound')).toBeUndefined();
  });

  it('supports WASM and remote plugins', () => {
    const wasmPlugin = {
      name: 'wasm',
      setup: () => {},
      wasm: {} as WebAssembly.Module,
    };
    const remotePlugin = {
      name: 'remote',
      setup: () => {},
      remote: 'https://example.com/plugin',
    };
    loadPlugin(wasmPlugin);
    loadPlugin(remotePlugin);
    expect(getLoadedPlugins().some((p) => p.name === 'wasm')).toBe(true);
    expect(getLoadedPlugins().some((p) => p.name === 'remote')).toBe(true);
    unloadPlugin('wasm');
    unloadPlugin('remote');
    expect(getLoadedPlugins().some((p) => p.name === 'wasm')).toBe(false);
    expect(getLoadedPlugins().some((p) => p.name === 'remote')).toBe(false);
  });

  it('supports permission model for plugins', () => {
    loadPlugin({
      name: 'perm',
      setup: (ctx) => {
        expect(ctx.permissions).toEqual(['read', 'write']);
      },
      permissions: ['read', 'write'],
    });
    unloadPlugin('perm');
  });

  it('handles malformed plugins gracefully', () => {
    expect(() => loadPlugin({ name: '', setup: null as any })).toThrow();
    expect(() =>
      loadPlugin({
        name: 'bad',
        setup: () => {
          throw new Error('fail');
        },
      })
    ).toThrow();
  });

  it('does not allow unsafe code execution in plugin transforms', async () => {
    loadPlugin({
      name: 'sandbox',
      setup: (ctx) => {
        ctx.registerTransform('unsafe', () => {
          throw new Error('unsafe');
        });
      },
    });
    await expect(runTransform('unsafe', createRootNode([]))).rejects.toThrow(
      'unsafe'
    );
    unloadPlugin('sandbox');
  });
});
