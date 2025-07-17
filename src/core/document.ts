/**
 * Error thrown when a document node is not found.
 */
export class DocumentNodeNotFoundError extends Error {
  constructor(_id: string) {
    super('Node not found');
    this.name = 'DocumentNodeNotFoundError';
  }
}

/**
 * Generic recursive map helper for document trees.
 * Applies fn to each node, returning a new tree.
 * @param node - The root node
 * @param fn - Function to apply to each node
 * @returns The new tree
 */
export function mapTree(
  node: DocumentNode,
  fn: (node: DocumentNode) => DocumentNode
): DocumentNode {
  const mapped = fn(node);
  if (!mapped.children) return mapped;
  return {
    ...mapped,
    children: mapped.children.map((child) => mapTree(child, fn)),
  };
}

/**
 * NodeType defines all possible node types in the document tree.
 * This includes all block and inline elements relevant to Markdown/CommonMark,
 * as well as extensibility for rich text editors and future formats.
 */
export type NodeType =
  // Block-level elements
  | 'root' // Document root
  | 'paragraph' // Paragraph block
  | 'heading' // Heading block (attrs.level: 1-6)
  | 'list' // List block (attrs.ordered: boolean)
  | 'listItem' // List item
  | 'code' // Code block (attrs.lang: string)
  | 'blockquote' // Blockquote
  | 'thematicBreak' // Horizontal rule (---)
  | 'table' // Table block
  | 'tableRow' // Table row
  | 'tableCell' // Table cell (attrs.header: boolean, attrs.align)

  // Inline elements
  | 'text' // Plain text
  | 'emphasis' // *emphasis* (italic)
  | 'strong' // **strong** (bold)
  | 'inlineCode' // `inline code`
  | 'link' // [text](href)
  | 'image'; // ![alt](src)

/**
 * NodeAttributes represents a map of custom attributes for a document node.
 *
 * Common attributes by node type:
 * - heading: { level: number }
 * - list: { ordered: boolean }
 * - code: { lang?: string }
 * - link: { href: string, title?: string }
 * - image: { src: string, alt?: string, title?: string }
 * - tableCell: { header?: boolean, align?: 'left' | 'center' | 'right' }
 */
export type NodeAttributes = Readonly<Record<string, unknown>>;

/**
 * DocumentNode represents a node in the immutable document tree.
 *
 * - id: Unique identifier for the node (string, required)
 * - type: NodeType (required)
 * - children: Child nodes (for non-leaf nodes, optional)
 * - attrs: Custom attributes for the node (optional, see NodeAttributes)
 * - text: Text content (for text/inline nodes, optional)
 *
 * This structure enables:
 * - Rich, extensible document modeling
 * - Lossless round-trip serialization for HTML, Markdown, JSON, and custom formats
 * - Plugin-based transformation, normalization, and validation
 * - Full support for block and inline semantics, including tables, code, links, images, and more
 */
export type DocumentNode = {
  readonly id: string;
  readonly type: NodeType;
  readonly children?: readonly DocumentNode[];
  readonly attrs?: NodeAttributes;
  readonly text?: string;
};

/**
 * Document is an alias for DocumentNode.
 * It represents the structure of the entire document.
 */
export type Document = DocumentNode;

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
