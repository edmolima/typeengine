import { describe, it, expect } from 'vitest';
import { jsonSerializer } from '../../../src/core/formats/json';
import type { DocumentNode } from '../../../src/core/document';

const minimalDoc: DocumentNode = { id: 'root', type: 'root', children: [] };
const headingDoc: DocumentNode = {
  id: 'root',
  type: 'root',
  children: [
    {
      id: 'h1',
      type: 'heading',
      attrs: { level: 2 },
      children: [{ id: 't1', type: 'text', text: 'Heading', children: [] }],
    },
  ],
};
const listDoc: DocumentNode = {
  id: 'root',
  type: 'root',
  children: [
    {
      id: 'l1',
      type: 'list',
      attrs: { ordered: true },
      children: [
        {
          id: 'li1',
          type: 'listItem',
          children: [{ id: 't1', type: 'text', text: 'Item 1', children: [] }],
        },
        {
          id: 'li2',
          type: 'listItem',
          children: [{ id: 't2', type: 'text', text: 'Item 2', children: [] }],
        },
      ],
    },
  ],
};
const codeDoc: DocumentNode = {
  id: 'root',
  type: 'root',
  children: [
    {
      id: 'c1',
      type: 'code',
      attrs: { lang: 'js' },
      text: 'console.log(1);',
      children: [],
    },
  ],
};

describe('jsonSerializer', () => {
  it('serializes a minimal document', () => {
    const json = jsonSerializer.serialize(minimalDoc);
    expect(json).toBe(JSON.stringify(minimalDoc));
  });

  it('deserializes a minimal document', () => {
    const json = JSON.stringify(minimalDoc);
    const doc = jsonSerializer.deserialize(json);
    expect(doc).toEqual(minimalDoc);
  });

  it('serializes and deserializes a heading document (round-trip)', () => {
    const json = jsonSerializer.serialize(headingDoc);
    const doc = jsonSerializer.deserialize(json);
    expect(doc).toEqual(headingDoc);
  });

  it('serializes and deserializes a list document (round-trip)', () => {
    const json = jsonSerializer.serialize(listDoc);
    const doc = jsonSerializer.deserialize(json);
    expect(doc).toEqual(listDoc);
  });

  it('serializes and deserializes a code document (round-trip)', () => {
    const json = jsonSerializer.serialize(codeDoc);
    const doc = jsonSerializer.deserialize(json);
    expect(doc).toEqual(codeDoc);
  });

  it('throws on invalid JSON', () => {
    expect(() => jsonSerializer.deserialize('{invalid json')).toThrow(
      'Invalid JSON'
    );
  });

  it('throws if not a DocumentNode: not an object', () => {
    expect(() => jsonSerializer.deserialize('null')).toThrow('not an object');
    expect(() => jsonSerializer.deserialize('42')).toThrow('not an object');
    expect(() => jsonSerializer.deserialize('"string"')).toThrow(
      'not an object'
    );
  });

  it('throws if missing type', () => {
    const bad = JSON.stringify({ children: [] });
    expect(() => jsonSerializer.deserialize(bad)).toThrow('missing type');
  });

  it('throws if missing children', () => {
    const bad = JSON.stringify({ type: 'doc' });
    expect(() => jsonSerializer.deserialize(bad)).toThrow('missing children');
  });
});
