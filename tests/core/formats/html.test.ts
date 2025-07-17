import { describe, it, expect, vi } from 'vitest';
import {
  htmlSerializer,
  htmlDeserializer,
} from '../../../src/core/formats/html';
import type { DocumentNode } from '../../../src/core/document';

describe('HTML Serializer/Deserializer', () => {
  // Helper for a minimal document
  function makeDoc(): DocumentNode {
    return {
      id: 'root',
      type: 'root',
      attrs: {},
      text: '',
      children: [
        {
          id: 'p1',
          type: 'paragraph',
          attrs: { align: 'left' },
          text: '',
          children: [
            {
              id: 't1',
              type: 'text',
              attrs: {},
              text: 'Hello',
              children: [],
            },
            {
              id: 't2',
              type: 'text',
              attrs: {},
              text: ' world!',
              children: [],
            },
          ],
        },
      ],
    };
  }

  it('serializes and deserializes to equivalent structure (round-trip, ignoring ids)', () => {
    // Note: HTML does not preserve node ids, so we check structure and content only
    const doc = makeDoc();
    const html = htmlSerializer.serialize(doc);
    const parsed = htmlDeserializer.deserialize(html);
    expect(parsed.type).toBe('root');
    expect(Array.isArray(parsed.children)).toBe(true);
    expect(parsed.children?.length).toBe(1);
    const para = parsed.children?.[0];
    expect(para?.type).toBe('paragraph');
    expect(para?.attrs?.align).toBe('left');
    // The deserializer merges adjacent text nodes, so only one text node is expected
    expect(Array.isArray(para?.children)).toBe(true);
    expect(para?.children?.length).toBe(1);
    const textNode = para?.children?.[0];
    expect(textNode?.type).toBe('text');
    expect(textNode?.text).toBe('Hello world!');
  });

  it('preserves all node attributes', () => {
    const doc = makeDoc();
    const html = htmlSerializer.serialize(doc);
    expect(html).toContain('align="left"');
    const parsed = htmlDeserializer.deserialize(html);
    expect(parsed.children?.[0]?.attrs?.align).toBe('left');
  });

  it('throws on malformed HTML (unclosed tag)', () => {
    expect(() => htmlDeserializer.deserialize('<div><p>Unclosed')).toThrow(
      'Malformed HTML'
    );
  });

  it('calls custom serializeNode hook', () => {
    const doc = makeDoc();
    const spy = vi.fn((node, next) => {
      if (node.type === 'paragraph')
        return (
          '<p class="custom">' + node.children?.map(next).join('') + '</p>'
        );
    });
    const html = htmlSerializer.serialize(doc, { serializeNode: spy });
    expect(html).toContain('class="custom"');
    expect(spy).toHaveBeenCalled();
  });

  it('calls custom deserializeNode hook', () => {
    const spy = vi.fn((tag, attrs, children) => {
      if (tag === 'p')
        return {
          id: 'custom',
          type: 'paragraph' as import('../../../src/core/document').NodeType,
          attrs,
          children,
        };
    });
    const html = '<div><p align="left">Hello world!</p></div>';
    const parsed = htmlDeserializer.deserialize(html, { deserializeNode: spy });
    expect(parsed.children?.[0]?.id).toBe('custom');
    expect(spy).toHaveBeenCalled();
  });
});
