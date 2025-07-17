import { describe, it, expect } from 'vitest';
import { createRootNode, DocumentNode } from '../src/document';
import { insertNode } from '../src/insertNode';

function createTextNode(id: string, text: string): DocumentNode {
  return { id, type: 'text', text };
}

describe('insertNode', () => {
  it('inserts a node as a child of the specified parent', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([]);
    const updated = insertNode(root, 'root', t1, 0);
    expect(updated.children).toEqual([t1]);
    expect(root.children).toEqual([]);
  });

  it('inserts a node at the correct position among siblings', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1, t2] };
    const root = createRootNode([para]);
    const t3 = createTextNode('t3', 'C');
    const updated = insertNode(root, 'p1', t3, 1);
    expect(updated.children?.[0].children).toEqual([t1, t3, t2]);
    const updated2 = insertNode(root, 'p1', t3, 2);
    expect(updated2.children?.[0].children).toEqual([t1, t2, t3]);
    const updated3 = insertNode(root, 'p1', t3, 0);
    expect(updated3.children?.[0].children).toEqual([t3, t1, t2]);
  });

  it('inserts deeply in a nested tree', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const t3 = createTextNode('t3', 'C');
    const updated = insertNode(root, 't1', t3, 0);
    expect(updated.children?.[0].children?.[0].children).toEqual([t3]);
  });

  it('throws for invalid parent id (direct and nested)', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([]);

    expect(() => insertNode(root, 'notfound', t1, 0)).toThrow(
      'Parent node not found'
    );

    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root2 = createRootNode([para]);
    expect(() => insertNode(root2, 'notfound', t1, 0)).toThrow(
      'Parent node not found'
    );

    try {
      insertNode(root, 'notfound', t1, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('Parent node not found');
    }
  });

  it('returns child unchanged if inserting into a leaf node (coverage for return child)', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1, t2] };
    const root = createRootNode([para]);
    expect(() => insertNode(root, 'notfound', t1, 0)).toThrow(
      'Parent node not found'
    );
  });

  it('throws for out-of-bounds index', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([]);
    expect(() => insertNode(root, 'root', t1, 1)).toThrow(
      'Index out of bounds'
    );
    expect(() => insertNode(root, 'root', t1, -1)).toThrow(
      'Index out of bounds'
    );
  });

  it('does not mutate any part of the original tree', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const t3 = createTextNode('t3', 'C');
    const snapshot = JSON.stringify(root);
    insertNode(root, 'p1', t3, 1);
    expect(JSON.stringify(root)).toBe(snapshot);
  });
});
