import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { deserializeDocument } from '../../src/core/deserialize';
import { serializeDocument } from '../../src/core/serialize';
import type { DocumentNode } from '../../src/core/document';

describe('Edge case fuzzing', () => {
  it('handles deeply nested documents', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (depth) => {
        let node: any = { id: 'root', type: 'root', children: [] };
        let current = node;
        for (let i = 0; i < depth; i++) {
          const child: any = { id: `n${i}`, type: 'paragraph', children: [] };
          if (!current.children) current.children = [];
          current.children.push(child);
          current = child;
        }
        const json = serializeDocument(node, { format: 'json' });
        const roundtrip = deserializeDocument(json, { format: 'json' });
        expect(roundtrip).toBeDefined();
      })
    );
  });

  it('handles malformed documents gracefully', () => {
    const malformed =
      '{"id":"root","type":"root","children":[{"id":1,"type":null}]';
    expect(() => deserializeDocument(malformed, { format: 'json' })).toThrow();
  });

  it('handles adversarial documents', () => {
    const adversarial =
      '{"id":"root","type":"root","children":[{"id":"evil","type":"script","text":"<script>alert(1)</script>"}]}';
    const doc = deserializeDocument(adversarial, { format: 'json' });
    expect(doc.children?.[0]?.type).toBe('script');
    expect(doc.children?.[0]?.text).toContain('<script>');
  });
});
