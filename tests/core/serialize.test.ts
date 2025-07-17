describe('serializeDocument (extra coverage)', () => {
  it('throws on unknown format', () => {
    expect(() =>
      serializeDocument({} as any, { format: 'unknown' as any })
    ).toThrow('Unknown format');
  });

  it('calls plugin serializer if provided', () => {
    const plugin = {
      format: 'custom',
      serializer: { serialize: () => 'plugin!' },
      deserializer: {
        deserialize: () => ({
          id: 'x',
          type: 'root' as import('../../src/core').NodeType,
          attrs: {},
          text: '',
          children: [],
        }),
      },
    };
    const result = serializeDocument({} as any, {
      format: 'custom' as any,
      plugins: [plugin],
    });
    expect(result).toBe('plugin!');
  });
});
import { describe, it, expect } from 'vitest';
import { serializeDocument, deserializeDocument } from '../../src/core';
import type { DocumentNode } from '../../src/core';

// Minimal doc for round-trip
const doc: DocumentNode = {
  id: 'root',
  type: 'root',
  attrs: {},
  text: '',
  children: [
    {
      id: 'p1',
      type: 'paragraph',
      attrs: { align: 'center' },
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

describe('serialize', () => {
  it('serializes a DocumentNode to JSON string', () => {
    const json = serializeDocument(doc, { format: 'json' });
    expect(typeof json).toBe('string');
    expect(json).toContain('Hello');
    expect(json).toContain('align');
  });
});

describe('deserialize', () => {
  it('deserializes a JSON string to DocumentNode', () => {
    const json = serializeDocument(doc, { format: 'json' });
    const parsed = deserializeDocument(json, { format: 'json' });
    expect(parsed).toBeTruthy();
    expect(parsed.type).toBe('root');
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.attrs?.align).toBe('center');
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
});
