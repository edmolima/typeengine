import type { DocumentNode } from './document';
import { mapTree, DocumentNodeNotFoundError } from './document';

/**
 * Removes a node (by id) from the document tree, returning a new tree.
 * Throws if the node is not found. The root node cannot be removed.
 *
 * @param tree - The original document tree
 * @param nodeId - The id of the node to remove
 * @returns A new document tree without the node
 * @throws If nodeId is not found or is the root
 */
export function removeNode(tree: DocumentNode, nodeId: string): DocumentNode {
  if (tree.id === nodeId) {
    throw new Error('Cannot remove the root node');
  }
  let removed = false;
  const result = mapTree(tree, (node) => {
    if (!node.children) return node;
    const filtered = node.children.filter((child) => child.id !== nodeId);
    if (filtered.length !== node.children.length) {
      removed = true;
      return { ...node, children: filtered };
    }
    return node;
  });
  if (!removed) throw new DocumentNodeNotFoundError(nodeId);
  return result;
}
