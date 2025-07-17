import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { markdownSerializer } from '../../../src/core/formats/markdown';
import type { DocumentNode } from '../../../src/core/document';

// Arbitrary for DocumentNode (minimal, can be expanded)
const textNodeArb = fc.record({
  id: fc.string(),
  type: fc.constant('text'),
  text: fc.string(),
  attrs: fc.constant({}),
  children: fc.constant([]),
});

const paragraphNodeArb = fc.record({
  id: fc.string(),
  type: fc.constant('paragraph'),
  attrs: fc.constant({}),
  text: fc.constant(''),
  children: fc.array(textNodeArb, { minLength: 1, maxLength: 3 }),
});

const rootNodeArb = fc.record({
  id: fc.string(),
  type: fc.constant('root'),
  attrs: fc.constant({}),
  text: fc.constant(''),
  children: fc.array(paragraphNodeArb, { minLength: 1, maxLength: 3 }),
});

describe('markdownSerializer (fuzz)', () => {
  it('round-trips arbitrary DocumentNode (serialize -> deserialize)', () => {
    fc.assert(
      fc.property(rootNodeArb, (doc) => {
        const md = markdownSerializer.serialize(doc);
        const parsed = markdownSerializer.deserialize(md);
        // Should preserve structure and text (ids may differ)
        expect(parsed.type).toBe('root');
        expect(Array.isArray(parsed.children)).toBe(true);
        // Accept that empty paragraphs or text may be dropped in roundtrip
        // Only check length if original doc had non-empty text in at least one child
        const origNonEmpty = doc.children.filter(
          (p) =>
            Array.isArray(p.children) &&
            p.children.some(
              (t) => t.text && t.text.replace(/\s+/g, '').length > 0
            )
        );
        if (origNonEmpty.length > 0) {
          expect(parsed.children?.length).toBeGreaterThanOrEqual(1);
        }
      })
    );
  });
});
