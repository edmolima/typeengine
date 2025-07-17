import { describe, it, expect } from 'vitest';
import { deserializeDocument } from '../../src/core';
import type { DocumentNode } from '../../src/core';

describe('deserializeDocument', () => {
  it('deserializes valid JSON string to DocumentNode', () => {
    const doc: DocumentNode = {
      id: 'root',
      type: 'root',
      attrs: {},
      text: '',
      children: [
        {
          id: 'p1',
          type: 'paragraph',
          attrs: {},
          text: '',
          children: [
            {
              id: 't1',
              type: 'text',
              attrs: {},
              text: 'Hello',
              children: [],
            },
          ],
        },
      ],
    };
    const json = JSON.stringify(doc);
    const parsed = deserializeDocument(json, { format: 'json' });
    expect(parsed).toBeTruthy();
    expect(parsed.type).toBe('root');
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.children?.[0]?.text).toBe('Hello');
  });

  it('throws on invalid JSON', () => {
    expect(() =>
      deserializeDocument('{invalid json', { format: 'json' })
    ).toThrow();
  });

  it('throws if not a DocumentNode', () => {
    expect(() => deserializeDocument('123', { format: 'json' })).toThrow();
    expect(() => deserializeDocument('"string"', { format: 'json' })).toThrow();
  });

  it('throws on unknown format', () => {
    expect(() =>
      deserializeDocument('{}', { format: 'unknown' as any })
    ).toThrow('Unknown format');
  });

  it('calls plugin deserializer if provided', () => {
    const plugin = {
      format: 'custom',
      serializer: { serialize: () => '' }, // dummy serializer for type
      deserializer: {
        deserialize: (_str: string) => ({
          id: 'x',
          type: 'root' as import('../../src/core').NodeType,
          attrs: {},
          text: '',
          children: [],
        }),
      },
    };
    const parsed = deserializeDocument('anything', {
      format: 'custom' as any,
      plugins: [plugin],
    });
    expect(parsed.id).toBe('x');
  });
});
