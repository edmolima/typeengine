import type { DocumentNode } from './document';
import { mapTree, DocumentNodeNotFoundError } from './document';

/**
 * Inserts a new node as a child of the specified parent node at the given index.
 * Returns a new document tree (immutable, does not mutate the original).
 *
 * @param tree - The original document tree (not mutated)
 * @param parentId - The ID of the parent node to insert into
 * @param newNode - The node to insert
 * @param index - The position (0-based) among the parent's children
 * @returns A new document tree with the node inserted
 * @throws If parentId is not found or index is invalid
 */
export function insertNode(
  tree: DocumentNode,
  parentId: string,
  newNode: DocumentNode,
  index: number
): DocumentNode {
  let inserted = false;
  const result = mapTree(tree, (node) => {
    if (node.id === parentId) {
      const children = node.children ? [...node.children] : [];
      if (index < 0 || index > children.length) {
        throw new Error('Index out of bounds');
      }
      inserted = true;
      return {
        ...node,
        children: [
          ...children.slice(0, index),
          newNode,
          ...children.slice(index),
        ],
      };
    }
    return node;
  });
  if (!inserted) throw new DocumentNodeNotFoundError(parentId);
  return result;
}
