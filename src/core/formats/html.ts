import type { Document, DocumentNode, NodeType } from '../document';

/**
 * Escapes HTML special characters in a string for safe output.
 * @param str - The string to escape.
 * @returns The escaped string.
 */
function escapeHtml(str: string): string {
  return str.replace(
    /[&<>"]|'/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ] || c)
  );
}

/**
 * Converts a record of attributes to an HTML attribute string.
 * @param attrs - The attributes object.
 * @returns The HTML attribute string.
 */
function attrsToHtml(attrs?: Record<string, unknown>): string {
  if (!attrs) return '';
  return (
    ' ' +
    Object.entries(attrs)
      .map(([k, v]) => `${k}="${escapeHtml(String(v))}"`)
      .join(' ')
  );
}

/**
 * Options for customizing HTML serialization/deserialization.
 */
export interface HtmlFormatOptions {
  /**
   * Map node type to HTML tag and attribute transform.
   */
  nodeToTag?: Record<
    string,
    {
      tag: string;
      attrs?: (attrs: Record<string, unknown>) => Record<string, unknown>;
    }
  >;
  /**
   * Map HTML tag to node type and attribute transform.
   */
  tagToNode?: Record<
    string,
    {
      type: string;
      attrs?: (attrs: Record<string, unknown>) => Record<string, unknown>;
    }
  >;
  /**
   * Hook for custom node serialization.
   */
  serializeNode?: (
    node: DocumentNode,
    next: (node: DocumentNode) => string
  ) => string | undefined;
  /**
   * Hook for custom node deserialization.
   */
  deserializeNode?: (
    tag: string,
    attrs: Record<string, unknown>,
    children: ParseNode[]
  ) => ParseNode | undefined;
}

const defaultNodeToTag = {
  root: { tag: 'div' },
  paragraph: { tag: 'p' },
  text: { tag: '' },
} as const;

const defaultTagToNode = {
  div: { type: 'root' },
  p: { type: 'paragraph' },
} as const;

/**
 * Serializes a DocumentNode to an HTML string, extensible via options.
 * @param node - The document node to serialize.
 * @param options - Optional extensibility hooks and mappings.
 * @returns The HTML string.
 */
function nodeToHtml(node: DocumentNode, options?: HtmlFormatOptions): string {
  const { nodeToTag = defaultNodeToTag, serializeNode } = options || {};
  if (serializeNode) {
    const custom = serializeNode(node, (n) => nodeToHtml(n, options));
    if (typeof custom === 'string') return custom;
  }
  if (node.type === 'text') {
    return escapeHtml(node.text || '');
  }
  const mapping = (nodeToTag as Record<string, { tag: string }>)[node.type] || {
    tag: node.type,
  };
  const tag = mapping.tag;
  // Type guard for mapping.attrs
  const attrs =
    'attrs' in mapping && typeof mapping.attrs === 'function'
      ? mapping.attrs(node.attrs || {})
      : node.attrs;
  const children = (node.children || [])
    .map((child) => nodeToHtml(child, options))
    .join('');
  if (!tag) return children;
  return `<${tag}${attrsToHtml(attrs)}>${children}</${tag}>`;
}

/**
 * Parses an HTML attribute string into a record of attributes.
 * @param str - The attribute string.
 * @returns The parsed attributes object, or undefined if none found.
 */
function parseAttrs(
  str: string | undefined
): Record<string, unknown> | undefined {
  if (!str) return undefined;
  const attrs: Record<string, unknown> = {};
  const attrPattern = /([a-zA-Z0-9_-]+)="([^\"]*)"/g;
  let match;
  while ((match = attrPattern.exec(str))) {
    if (match[1]) attrs[match[1]] = match[2];
  }
  return Object.keys(attrs).length ? attrs : undefined;
}

type ParseNode = Omit<DocumentNode, 'children'> & { children?: ParseNode[] };

/**
 * Parses an HTML string into a DocumentNode tree, extensible via options.
 * Functional, immutable, and type-safe.
 * @param html - The HTML string to parse.
 * @param options - Optional extensibility hooks and mappings.
 * @returns The root DocumentNode.
 * @throws If the HTML is malformed.
 */
function htmlToNode(html: string, options?: HtmlFormatOptions): DocumentNode {
  const { tagToNode = defaultTagToNode, deserializeNode } = options || {};
  const tagPattern = /<(\/)?([a-zA-Z0-9]+)([^>]*)>/g;
  let lastIndex = 0;
  let stack: ParseNode[] = [];
  let root: ParseNode | undefined;

  const safeAttrs = (
    attrs: Record<string, unknown> | undefined
  ): Readonly<Record<string, unknown>> => (attrs ? attrs : {});
  const safeChildren = (
    children: ParseNode[] | undefined
  ): readonly ParseNode[] =>
    Array.isArray(children) ? children.filter((c): c is ParseNode => !!c) : [];

  const pushText = (text: string, stackIn: ParseNode[]): ParseNode[] => {
    const trimmed = text.trim();
    if (!trimmed || stackIn.length === 0) return stackIn;
    const parent = stackIn[stackIn.length - 1];
    if (!parent) return stackIn;
    return [
      ...stackIn.slice(0, -1),
      {
        ...parent,
        children: [
          ...safeChildren(parent.children),
          { id: '', type: 'text', text: trimmed, attrs: {}, children: [] },
        ],
      },
    ];
  };

  let match;
  while ((match = tagPattern.exec(html))) {
    const [, closingRaw, tag, attrStr] = match;
    const closing = !!closingRaw;
    const text = html.slice(lastIndex, match.index);
    stack = pushText(text, stack);

    if (!closing) {
      const attrs = safeAttrs(parseAttrs(attrStr));
      let node: ParseNode | undefined;
      if (deserializeNode && typeof tag === 'string') {
        node = deserializeNode(tag, attrs, []);
      }
      if (!node) {
        let mapping:
          | {
              type: string;
              attrs?: (
                attrs: Record<string, unknown>
              ) => Record<string, unknown>;
            }
          | undefined;
        if (
          typeof tag === 'string' &&
          Object.prototype.hasOwnProperty.call(tagToNode, tag)
        ) {
          mapping = (
            tagToNode as Record<
              string,
              {
                type: string;
                attrs?: (
                  attrs: Record<string, unknown>
                ) => Record<string, unknown>;
              }
            >
          )[tag];
        }
        if (!mapping) {
          mapping = { type: 'unknown' };
        }
        node = {
          id: '',
          type: mapping.type as NodeType,
          attrs:
            'attrs' in mapping && typeof mapping.attrs === 'function'
              ? mapping.attrs(attrs)
              : attrs,
          children: [],
        };
      }
      if (node) {
        stack = [...stack, node];
      }
    } else {
      const node = stack[stack.length - 1];
      const rest = stack.slice(0, -1);
      if (rest.length > 0) {
        const parent = rest[rest.length - 1];
        if (!parent) {
          stack = rest;
        } else {
          stack = [
            ...rest.slice(0, -1),
            {
              ...parent,
              children: [
                ...safeChildren(parent.children),
                ...(node ? [node] : []),
              ],
            },
          ];
        }
      } else {
        root = node;
        stack = [];
      }
    }
    lastIndex = tagPattern.lastIndex;
  }

  if (lastIndex < html.length) {
    stack = pushText(html.slice(lastIndex), stack);
  }

  // If stack is not empty or root is undefined, HTML is malformed (unclosed tags)
  if (!root || stack.length > 0) {
    throw new Error('Malformed HTML');
  }

  return freezeNode(root);
}

/**
 * Recursively freezes a ParseNode tree into a DocumentNode tree.
 * Ensures all arrays are readonly and attributes are always present.
 * @param node - The parse node to freeze.
 * @returns The frozen DocumentNode.
 */
function freezeNode(node: ParseNode): DocumentNode {
  const { children, ...rest } = node;
  return {
    ...rest,
    attrs: node.attrs || {},
    children: (children
      ? children.filter(Boolean).map(freezeNode)
      : []
    ).slice() as readonly DocumentNode[],
  };
}

/**
 * HTML serializer for the core document model.
 */
/**
 * HTML serializer for the core document model, with extensibility options.
 */

export const htmlSerializer = {
  serialize(doc: Document, options?: HtmlFormatOptions) {
    return nodeToHtml(doc, options);
  },
};

/**
 * HTML deserializer for the core document model, with extensibility options.
 */

export const htmlDeserializer = {
  deserialize(str: string, options?: HtmlFormatOptions) {
    return htmlToNode(str, options);
  },
};
