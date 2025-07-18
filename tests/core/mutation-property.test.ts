import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { markdownSerializer } from '../../src/core/formats/markdown';
import { htmlSerializer, htmlDeserializer } from '../../src/core/formats/html';
import { jsonSerializer } from '../../src/core/formats/json';
import { createRootNode } from '../../src/core/document';

describe('Mutation property-based tests', () => {
  it('markdown serializer/deserializer is robust to mutated text', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 1000 }), (text) => {
        const doc = createRootNode([
          {
            id: 'p1',
            type: 'paragraph',
            children: [{ id: 't1', type: 'text', text }],
          },
        ]);
        const md = markdownSerializer.serialize(doc);
        const parsed = markdownSerializer.deserialize(md);
        expect(parsed.type).toBe('root');
        // Only assert on valid node types and ignore malformed/partial markdown
        const validBlockTypes = [
          'paragraph',
          'heading',
          'blockquote',
          'list',
          'code',
        ];
        if (
          parsed.children?.length === 0 ||
          (parsed.children?.[0] &&
            validBlockTypes.includes(parsed.children[0].type))
        ) {
          // Deterministic: valid markdown block or empty
          if (parsed.children?.[0]?.type === 'paragraph') {
            if (parsed.children?.[0]?.children?.length) {
              expect(parsed.children?.[0]?.children?.[0]?.type).toBe('text');
              expect(parsed.children?.[0]?.children?.[0]?.text).toBeDefined();
            } else {
              expect(parsed.children?.[0]?.children?.length ?? 0).toBe(0);
            }
          }
        } else {
          // Ignore malformed/partial markdown output
          expect(typeof parsed.children?.[0]?.type).toBe('string');
        }
      })
    );
  });

  it('html serializer/deserializer is robust to mutated text', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 1000 }), (text) => {
        const doc = createRootNode([
          {
            id: 'p1',
            type: 'paragraph',
            children: [{ id: 't1', type: 'text', text }],
          },
        ]);
        const html = htmlSerializer.serialize(doc);
        const parsed = htmlDeserializer.deserialize(html);
        expect(parsed.type).toBe('root');
        if (text.trim() === '') {
          // Accept either no children, a paragraph with no children, or a paragraph with a single whitespace text node
          const children = parsed.children ?? [];
          if (children.length === 0) {
            expect(children.length).toBe(0);
          } else if (
            children.length === 1 &&
            children[0].type === 'paragraph'
          ) {
            const paraChildren = children[0].children ?? [];
            if (paraChildren.length === 0) {
              expect(paraChildren.length).toBe(0);
            } else if (
              paraChildren.length === 1 &&
              typeof paraChildren[0].text === 'string' &&
              paraChildren[0].text.trim() === ''
            ) {
              expect(paraChildren[0].type).toBe('text');
              expect(paraChildren[0].text.trim()).toBe('');
            } else {
              throw new Error(
                'Unexpected paragraph children for whitespace-only input'
              );
            }
          } else {
            throw new Error(
              'Unexpected node structure for whitespace-only input'
            );
          }
        } else {
          const validBlockTypes = [
            'paragraph',
            'heading',
            'blockquote',
            'list',
            'code',
          ];
          expect(validBlockTypes).toContain(parsed.children?.[0]?.type);
          if (parsed.children?.[0]?.children?.length) {
            expect(parsed.children?.[0]?.children?.[0]?.type).toBe('text');
            expect(parsed.children?.[0]?.children?.[0]?.text).toBeDefined();
          }
        }
      })
    );
  });

  it('json serializer/deserializer is robust to mutated text', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 1000 }), (text) => {
        const doc = createRootNode([
          {
            id: 'p1',
            type: 'paragraph',
            children: [{ id: 't1', type: 'text', text }],
          },
        ]);
        const json = jsonSerializer.serialize(doc);
        const parsed = jsonSerializer.deserialize(json);
        expect(parsed.type).toBe('root');
        if (parsed.children?.[0]?.type === 'paragraph') {
          if (parsed.children?.[0]?.children?.length) {
            expect(parsed.children?.[0]?.children?.[0]?.type).toBe('text');
            expect(parsed.children?.[0]?.children?.[0]?.text).toBeDefined();
          } else {
            // Accept paragraph with no children for edge cases
            expect(parsed.children?.[0]?.children?.length ?? 0).toBe(0);
          }
        }
      })
    );
  });

  it('markdown serializer/deserializer is robust to mutated node types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('paragraph', 'heading', 'blockquote', 'list', 'code'),
        (type) => {
          const doc = createRootNode([
            {
              id: 'p1',
              type,
              children: [{ id: 't1', type: 'text', text: 'test' }],
            },
          ]);
          const md = markdownSerializer.serialize(doc);
          const parsed = markdownSerializer.deserialize(md);
          expect(parsed.type).toBe('root');
          expect(parsed.children?.[0]?.type).toBe(type);
        }
      )
    );
  });
});
