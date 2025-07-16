/**
 * NodeType represents the type of a node in the document tree.
 */
export type NodeType = 'root' | 'paragraph' | 'text';

/**
 * NodeAttributes represents a map of custom attributes for a document node.
 */
export type NodeAttributes = Readonly<Record<string, unknown>>;

/**
 * DocumentNode represents a node in the immutable document tree.
 * - `id`: Unique identifier for the node.
 * - `type`: The type of the node (e.g., root, paragraph, text).
 * - `children`: Optional, child nodes (for non-leaf nodes).
 * - `attrs`: Optional, custom attributes for the node.
 * - `text`: Optional, text content (for text nodes).
 */
export type DocumentNode = {
  readonly id: string;
  readonly type: NodeType;
  readonly children?: readonly DocumentNode[];
  readonly attrs?: NodeAttributes;
  readonly text?: string;
};

/**
 * Creates a new document root node.
 * @param children - Child nodes of the root (default: empty array)
 * @returns A new immutable root DocumentNode
 */
export function createRootNode(
  children: readonly DocumentNode[] = []
): DocumentNode {
  return {
    id: 'root',
    type: 'root',
    children,
  };
}

/**
 * Traverses the document tree in depth-first order.
 * @param node - The root node to start traversal from
 * @returns An array of all nodes in depth-first order
 */
export function traverse(node: DocumentNode): DocumentNode[] {
  const result: DocumentNode[] = [node];
  if (node.children) {
    for (const child of node.children) {
      result.push(...traverse(child));
    }
  }
  return result;
}
