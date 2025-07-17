import { describe, it, expect } from 'vitest';
import { createRootNode, DocumentNode } from '../../src/core/document';
import { setNodeAttributes } from '../../src/core/setNodeAttributes';

function createTextNode(id: string, text: string): DocumentNode {
  return { id, type: 'text', text };
}

describe('setNodeAttributes', () => {
  it('sets attributes on a node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    const updated = setNodeAttributes(root, 't1', { bold: true });
    expect(updated.children?.[0].attrs).toEqual({ bold: true });
    expect(root.children?.[0].attrs).toBeUndefined();
  });

  it('merges with existing attributes', () => {
    const t1 = { ...createTextNode('t1', 'A'), attrs: { italic: true } };
    const root = createRootNode([t1]);
    const updated = setNodeAttributes(root, 't1', { bold: true });
    expect(updated.children?.[0].attrs).toEqual({ italic: true, bold: true });
  });

  it('sets attributes deeply in a nested tree', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const updated = setNodeAttributes(root, 't1', { color: 'red' });
    expect(updated.children?.[0].children?.[0].attrs).toEqual({ color: 'red' });
  });

  it('throws for non-existent node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    expect(() => setNodeAttributes(root, 'notfound', { foo: 1 })).toThrow(
      'Node not found'
    );
  });

  it('does not mutate the original tree', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const snapshot = JSON.stringify(root);
    setNodeAttributes(root, 't1', { bar: 2 });
    expect(JSON.stringify(root)).toBe(snapshot);
  });
});
