import { describe, it, expect } from 'vitest';
import {
  createRootNode,
  traverse,
  DocumentNode,
} from '../../src/core/document';

function createTextNode(id: string, text: string): DocumentNode {
  return { id, type: 'text', text };
}

describe('createRootNode', () => {
  it('creates a root node with no children by default', () => {
    const root = createRootNode();
    expect(root.id).toBe('root');
    expect(root.type).toBe('root');
    expect(root.children).toEqual([]);
  });

  it('creates a root node with given children', () => {
    const child = createTextNode('t1', 'Hello');
    const root = createRootNode([child]);
    expect(root.children).toEqual([child]);
  });
});

describe('traverse', () => {
  it('returns only the root node for an empty tree', () => {
    const root = createRootNode();
    expect(traverse(root)).toEqual([root]);
  });

  it('returns nodes in depth-first order', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para = { id: 'p1', type: 'paragraph', children: [t1, t2] } as const;
    const root = createRootNode([para]);
    expect(traverse(root)).toEqual([root, para, t1, t2]);
  });

  it('handles deeply nested trees', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para1 = { id: 'p1', type: 'paragraph', children: [t1] } as const;
    const para2 = { id: 'p2', type: 'paragraph', children: [t2] } as const;
    const root = createRootNode([para1, para2]);
    expect(traverse(root)).toEqual([root, para1, t1, para2, t2]);
  });
});
