import { describe, it, expect } from 'vitest';
import { runTransform, loadPlugin } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const largeDoc: DocumentNode = {
  id: 'root',
  type: 'root',
  children: Array.from({ length: 10000 }, (_, i) => ({
    id: `p${i}`,
    type: 'paragraph',
    children: [{ id: `t${i}`, type: 'text', text: `text ${i}` }],
  })),
};

const dummyPlugin = {
  name: 'dummy',
  setup: (ctx: any) => {
    ctx.registerTransform('noop', (doc: DocumentNode) => doc);
  },
  permissions: ['read'],
};

describe('Performance at scale', () => {
  it('runs transforms on large documents efficiently', async () => {
    loadPlugin(dummyPlugin);
    const start = performance.now();
    const result = await runTransform('noop', largeDoc);
    const duration = performance.now() - start;
    expect(result.children?.length).toBe(10000);
    expect(duration).toBeLessThan(1000); // Should complete in <1s
  });

  it('runs concurrent transforms', async () => {
    loadPlugin(dummyPlugin);
    const promises = Array.from({ length: 10 }, () =>
      runTransform('noop', largeDoc)
    );
    const results = await Promise.all(promises);
    expect(results.every((r) => r.children?.length === 10000)).toBe(true);
  });
});
