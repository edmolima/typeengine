import { describe, it, expect, vi } from 'vitest';
import {
  htmlSerializer,
  htmlDeserializer,
} from '../../../src/core/formats/html';
import type { DocumentNode } from '../../../src/core/document';

describe('HTML Serializer/Deserializer', () => {
  it('does not execute or corrupt script tags in HTML', () => {
    const html = '<script>alert("xss")</script>';
    const parsed = htmlDeserializer.deserialize(html);
    expect(['html', 'text']).toContain(parsed.children?.[0]?.type);
    expect(parsed.children?.[0]?.text).toContain('alert("xss")');
    // Should not execute code, only treat as text
    const serialized = htmlSerializer.serialize(parsed);
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('unknown');
    expect(serialized).toMatch(/xss/);
  });

  it('parses and preserves dangerous links in HTML safely', () => {
    const html = '<a href="javascript:alert("xss")">malicious</a>';
    const parsed = htmlDeserializer.deserialize(html);
    expect(['html', 'text']).toContain(parsed.children?.[0]?.type);
    expect(parsed.children?.[0]?.text).toContain('malicious');
    const serialized = htmlSerializer.serialize(parsed);
    expect(serialized).toContain('unknown');
    expect(serialized).toMatch(/malicious/);
  });

  it('should never execute or preserve dangerous script tags', () => {
    const html = '<script>alert("xss")</script>';
    const parsed = htmlDeserializer.deserialize(html);
    expect(['html', 'text', 'unknown']).toContain(parsed.children?.[0]?.type);
    expect(parsed.children?.[0]?.text).toMatch(/xss/);
    const serialized = htmlSerializer.serialize(parsed);
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('unknown');
    expect(serialized).toMatch(/xss/);
  });

  it('should never execute or preserve dangerous links', () => {
    const html = '<a href="javascript:alert("xss")">malicious</a>';
    const parsed = htmlDeserializer.deserialize(html);
    expect(['html', 'text', 'unknown']).toContain(parsed.children?.[0]?.type);
    expect(parsed.children?.[0]?.text).toMatch(/malicious/);
    const serialized = htmlSerializer.serialize(parsed);
    expect(serialized).toContain('unknown');
    expect(serialized).toMatch(/malicious/);
  });

  it('should throw on dangerous image src (malformed HTML)', () => {
    const html = '<img src="javascript:alert("xss")" alt="xss" />';
    expect(() => htmlDeserializer.deserialize(html)).toThrow('Malformed HTML');
  });

  it('should throw on malformed HTML (unclosed tag)', () => {
    expect(() => htmlDeserializer.deserialize('<div><p>Unclosed')).toThrow(
      'Malformed HTML'
    );
  });

  it('should preserve all node attributes in round-trip', () => {
    const doc: DocumentNode = {
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
            { id: 't1', type: 'text', attrs: {}, text: 'Hello', children: [] },
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
    const html = htmlSerializer.serialize(doc);
    expect(html).toContain('align="left"');
    const parsed = htmlDeserializer.deserialize(html);
    expect(parsed.children?.[0]?.attrs?.align).toBe('left');
    expect(parsed.children?.[0]?.children?.[0]?.text).toContain('Hello world!');
  });

  it('should support custom serializeNode hook', () => {
    const doc: DocumentNode = {
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
            { id: 't1', type: 'text', attrs: {}, text: 'Hello', children: [] },
          ],
        },
      ],
    };
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

  it('should support custom deserializeNode hook', () => {
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
