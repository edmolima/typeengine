import { DocumentNode } from './document';

/**
 * Updates a node's attributes or text content by id, returning a new document tree.
 * Throws if the node is not found. The root node can be updated.
 *
 * @param tree - The original document tree
 * @param nodeId - The id of the node to update
 * @param update - Partial update: attributes and/or text
 * @returns A new document tree with the node updated
 * @throws If nodeId is not found
 */
export function updateNode(
  tree: DocumentNode,
  nodeId: string,
  update: Partial<Pick<DocumentNode, 'attrs' | 'text'>>
): DocumentNode {
  if (tree.id === nodeId) {
    return { ...tree, ...update };
  }
  if (!tree.children) {
    throw new Error('Node not found');
  }
  const newChildren = tree.children.map((child) => {
    try {
      return updateNode(child, nodeId, update);
    } catch {
      return child;
    }
  });
  if (tree.children.every((c, i) => c === newChildren[i])) {
    throw new Error('Node not found');
  }
  return { ...tree, children: newChildren };
}
