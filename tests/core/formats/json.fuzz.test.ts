import { describe, it, expect } from 'vitest';
import { jsonSerializer } from '../../../src/core/formats/json';
import type { DocumentNode } from '../../../src/core/document';
import fc from 'fast-check';

// Arbitrary for DocumentNode

// Only allow 'root' at the top, children are paragraph, which can have text or paragraph, text is leaf
function textNodeArb(): fc.Arbitrary<DocumentNode> {
  return fc
    .record({
      id: fc.string({ minLength: 1, maxLength: 8 }),
      type: fc.constant<'text'>('text'),
      children: fc.constant([]),
      text: fc.string({ maxLength: 32 }),
      attrs: fc.option(
        fc
          .dictionary(
            fc.string({ maxLength: 5 }),
            fc.oneof(
              fc.string({ maxLength: 10 }),
              fc.integer(),
              fc.boolean(),
              fc.constantFrom(null)
            )
          )
          .filter((obj) => Object.keys(obj).length > 0),
        { nil: undefined }
      ),
    })
    .map((node) => {
      if (!node.attrs || Object.keys(node.attrs).length === 0)
        delete node.attrs;
      return node as DocumentNode;
    });
}

function paragraphNodeArb(depth: number): fc.Arbitrary<DocumentNode> {
  return fc
    .record({
      id: fc.string({ minLength: 1, maxLength: 8 }),
      type: fc.constant<'paragraph'>('paragraph'),
      children:
        depth > 0
          ? fc.array(fc.oneof(paragraphNodeArb(depth - 1), textNodeArb()), {
              maxLength: 3,
            })
          : fc.array(textNodeArb(), { maxLength: 3 }),
      attrs: fc.option(
        fc
          .dictionary(
            fc.string({ maxLength: 5 }),
            fc.oneof(
              fc.string({ maxLength: 10 }),
              fc.integer(),
              fc.boolean(),
              fc.constantFrom(null)
            )
          )
          .filter((obj) => Object.keys(obj).length > 0),
        { nil: undefined }
      ),
    })
    .map((node) => {
      if (!node.attrs || Object.keys(node.attrs).length === 0)
        delete node.attrs;
      return node as DocumentNode;
    });
}

function rootNodeArb(depth: number): fc.Arbitrary<DocumentNode> {
  return fc
    .record({
      id: fc.constant('root'),
      type: fc.constant<'root'>('root'),
      children:
        depth > 0
          ? fc.array(paragraphNodeArb(depth - 1), { maxLength: 3 })
          : fc.constant([]),
      attrs: fc.option(
        fc
          .dictionary(
            fc.string({ maxLength: 5 }),
            fc.oneof(
              fc.string({ maxLength: 10 }),
              fc.integer(),
              fc.boolean(),
              fc.constantFrom(null)
            )
          )
          .filter((obj) => Object.keys(obj).length > 0),
        { nil: undefined }
      ),
    })
    .map((node) => {
      if (!node.attrs || Object.keys(node.attrs).length === 0)
        delete node.attrs;
      return node as DocumentNode;
    });
}

const documentNodeArb = rootNodeArb(2); // Limite de profundidade

describe('jsonSerializer (fuzz)', () => {
  it('round-trips arbitrary DocumentNode (serialize -> deserialize)', () => {
    fc.assert(
      fc.property(documentNodeArb, (doc) => {
        const json = jsonSerializer.serialize(doc);
        const parsed = jsonSerializer.deserialize(json);
        expect(parsed).toEqual(doc);
      })
    );
  });

  it('throws on malformed JSON', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          try {
            JSON.parse(s);
            return false;
          } catch {
            return true;
          }
        }),
        (badJson) => {
          expect(() => jsonSerializer.deserialize(badJson)).toThrow(
            'Invalid JSON'
          );
        }
      )
    );
  });
});
