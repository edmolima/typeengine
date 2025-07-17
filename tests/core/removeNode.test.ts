import { describe, it, expect } from 'vitest';
import { createRootNode, DocumentNode } from '../../src/core/document';
import { removeNode } from '../../src/core/removeNode';

function createTextNode(id: string, text: string): DocumentNode {
  return { id, type: 'text', text };
}

describe('removeNode', () => {
  it('removes a direct child node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    const updated = removeNode(root, 't1');
    expect(updated.children).toEqual([]);
    expect(root.children).toEqual([t1]);
  });

  it('removes a deeply nested node', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1, t2] };
    const root = createRootNode([para]);
    const updated = removeNode(root, 't2');
    expect(updated.children?.[0].children).toEqual([t1]);
  });

  it('throws for non-existent node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    expect(() => removeNode(root, 'notfound')).toThrow('Node not found');
  });

  it('throws if trying to remove the root node', () => {
    const root = createRootNode([]);
    expect(() => removeNode(root, 'root')).toThrow(
      'Cannot remove the root node'
    );
  });

  it('does not mutate the original tree', () => {
    const t1 = createTextNode('t1', 'A');
    const t2 = createTextNode('t2', 'B');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1, t2] };
    const root = createRootNode([para]);
    const snapshot = JSON.stringify(root);
    removeNode(root, 't2');
    expect(JSON.stringify(root)).toBe(snapshot);
  });
});
