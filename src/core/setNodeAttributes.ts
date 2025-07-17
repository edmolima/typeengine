import type { DocumentNode, NodeAttributes } from './document';
import { mapTree, DocumentNodeNotFoundError } from './document';

/**
 * Sets or updates attributes on a node by id, returning a new document tree.
 * Throws if the node is not found.
 *
 * @param tree - The original document tree
 * @param nodeId - The id of the node to update
 * @param attrs - The attributes to set or update (merged with existing)
 * @returns A new document tree with updated node attributes
 * @throws If nodeId is not found
 */
export function setNodeAttributes(
  tree: DocumentNode,
  nodeId: string,
  attrs: NodeAttributes
): DocumentNode {
  let updated = false;

  const result = mapTree(tree, (node) => {
    if (node.id === nodeId) {
      updated = true;

      return {
        ...node,
        attrs: {
          ...(node.attrs ?? {}),
          ...attrs,
        },
      };
    }

    return node;
  });

  if (!updated) {
    throw new DocumentNodeNotFoundError(nodeId);
  }

  return result;
}
