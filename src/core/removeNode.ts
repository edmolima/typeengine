import { DocumentNode } from './document';

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
  if (!tree.children) {
    return tree;
  }
  // Remove direct children with the id
  const filtered = tree.children.filter((child) => child.id !== nodeId);
  // Recursively process children
  const newChildren = filtered.map((child) => removeNode(child, nodeId));
  if (
    filtered.length === tree.children.length &&
    tree.children.every((c, i) => c === filtered[i]) &&
    tree.children.every((c, i) => c === newChildren[i])
  ) {
    throw new Error('Node not found');
  }
  return { ...tree, children: newChildren };
}
