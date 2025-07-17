import { describe, it, expect } from 'vitest';
import { createRootNode, DocumentNode } from '../../src/core/document';
import { updateNode } from '../../src/core/updateNode';

function createTextNode(id: string, text: string): DocumentNode {
  return { id, type: 'text', text };
}

describe('updateNode', () => {
  it('updates the text of a node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    const updated = updateNode(root, 't1', { text: 'B' });
    expect(updated.children?.[0].text).toBe('B');
    expect(root.children?.[0].text).toBe('A');
  });

  it('updates the attributes of a node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    const updated = updateNode(root, 't1', { attrs: { bold: true } });
    expect(updated.children?.[0].attrs).toEqual({ bold: true });
  });

  it('updates deeply nested nodes', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const updated = updateNode(root, 't1', { text: 'C' });
    expect(updated.children?.[0].children?.[0].text).toBe('C');
  });

  it('throws for non-existent node', () => {
    const t1 = createTextNode('t1', 'A');
    const root = createRootNode([t1]);
    expect(() => updateNode(root, 'notfound', { text: 'X' })).toThrow(
      'Node not found'
    );
  });

  it('does not mutate the original tree', () => {
    const t1 = createTextNode('t1', 'A');
    const para = { id: 'p1', type: 'paragraph' as const, children: [t1] };
    const root = createRootNode([para]);
    const snapshot = JSON.stringify(root);
    updateNode(root, 't1', { text: 'Z' });
    expect(JSON.stringify(root)).toBe(snapshot);
  });
});
