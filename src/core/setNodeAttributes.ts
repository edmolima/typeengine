import { DocumentNode, NodeAttributes } from './document';

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
  if (tree.id === nodeId) {
    return { ...tree, attrs: { ...(tree.attrs ?? {}), ...attrs } };
  }
  if (!tree.children) {
    throw new Error('Node not found');
  }
  const newChildren = tree.children.map((child) => {
    try {
      return setNodeAttributes(child, nodeId, attrs);
    } catch {
      return child;
    }
  });
  if (tree.children.every((c, i) => c === newChildren[i])) {
    throw new Error('Node not found');
  }
  return { ...tree, children: newChildren };
}
