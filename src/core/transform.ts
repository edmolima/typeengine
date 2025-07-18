import { DocumentNode, NODE_TYPES } from './document';

export type Transform = {
  op: string;
  payload: any;
  timestamp?: number;
  userId?: string;
};

export function applyTransform(
  doc: DocumentNode,
  transform: Transform
): DocumentNode {
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.children)) {
    throw new Error('Malformed document');
  }
  if (
    !transform ||
    typeof transform !== 'object' ||
    typeof transform.op !== 'string'
  ) {
    throw new Error('Malformed transform');
  }
  const children: DocumentNode[] = doc.children ?? [];
  switch (transform.op) {
    case 'insert': {
      // Insert at index (optional), else append
      const node = transform.payload as DocumentNode;
      if (
        !node ||
        typeof node.id !== 'string' ||
        typeof node.type !== 'string'
      ) {
        throw new Error('Malformed node for insert');
      }
      // Validate node type
      if (!NODE_TYPES.includes(node.type)) {
        throw new Error('Invalid node type for insert');
      }
      const idx =
        typeof transform.payload.index === 'number'
          ? transform.payload.index
          : children.length;
      const newChildren = [...children];
      newChildren.splice(idx, 0, node);
      return { ...doc, children: newChildren };
    }
    case 'remove': {
      const id = transform.payload.id;
      if (typeof id !== 'string') throw new Error('Malformed id for remove');
      return { ...doc, children: children.filter((c) => c.id !== id) };
    }
    case 'update': {
      const id = transform.payload.id;
      if (typeof id !== 'string') throw new Error('Malformed id for update');
      return {
        ...doc,
        children: children.map((c) =>
          c.id === id
            ? { ...c, ...transform.payload, type: c.type } // preserve type
            : c
        ),
      };
    }
    case 'move': {
      const { id, to } = transform.payload;
      if (typeof id !== 'string' || typeof to !== 'number')
        throw new Error('Malformed move payload');
      const idx = children.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Node not found for move');
      const node = children[idx];
      if (!node) throw new Error('Node not found for move');
      const newChildren = children.filter((c) => c.id !== id);
      newChildren.splice(to, 0, node);
      return { ...doc, children: newChildren };
    }
    case 'setAttribute': {
      const { id, key, value } = transform.payload;
      if (typeof id !== 'string' || typeof key !== 'string')
        throw new Error('Malformed setAttribute payload');
      return {
        ...doc,
        children: children.map((c) =>
          c.id === id ? { ...c, [key]: value } : c
        ),
      };
    }
    default:
      throw new Error('Unknown transform op: ' + transform.op);
  }
}

export function replayTransforms(
  initial: DocumentNode,
  transforms: Transform[]
): DocumentNode {
  if (!Array.isArray(transforms)) throw new Error('Malformed transforms');
  return transforms.reduce((doc, t) => applyTransform(doc, t), initial);
}

export function auditLog(transforms: Transform[]): string {
  if (!Array.isArray(transforms)) throw new Error('Malformed transforms');
  return transforms
    .map(
      (t) =>
        `${t.timestamp || ''} ${t.userId || ''} ${t.op} ${JSON.stringify(
          t.payload
        )}`
    )
    .join('\n');
}
