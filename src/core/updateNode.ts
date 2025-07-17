import type { DocumentNode } from './document';
import { mapTree, DocumentNodeNotFoundError } from './document';

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
  let updated = false;
  const result = mapTree(tree, (node) => {
    if (node.id === nodeId) {
      updated = true;
      return { ...node, ...update };
    }
    return node;
  });
  if (!updated) throw new DocumentNodeNotFoundError(nodeId);
  return result;
}
