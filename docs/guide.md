# Typeengine Documentation

## Overview

Blazing-fast, minimal, and extensible rich text core for building the editors of tomorrow.

---

## Features
- Immutable tree-based document model
- Functional, developer-first API
- Atomic operations: insert, remove, update, set_attr
- Zero dependencies
- Fully decoupled from UI and DOM
- Optional plugin system (no bloat)
- Headless rendering: React, Vue, mobile, server, CLI
- Native selection and customizable attributes
- Easy serialization/deserialization: JSON, Markdown, HTML
- Real-time collaboration ready: CRDT/OT pluggable
- Accessibility and internationalization support
- Top-tier DX: clear typing, concise docs, practical examples

---

## Document Model & API

### Document Model

The document is an immutable tree of nodes. Each node has:

- `id`: unique string
- `type`: 'root', 'paragraph', or 'text'
- `children`: array of child nodes (for non-leaf nodes)
- `attrs`: custom attributes (optional)
- `text`: text content (for text nodes)

#### Node Types

```ts
type NodeType = 'root' | 'paragraph' | 'text';

type NodeAttributes = Readonly<Record<string, unknown>>;

type DocumentNode = {
  readonly id: string;
  readonly type: NodeType;
  readonly children?: readonly DocumentNode[];
  readonly attrs?: NodeAttributes;
  readonly text?: string;
};
```

### Core Operations

All operations are pure and immutable: they never mutate the original document.

#### Create a root node
```ts
import { createRootNode } from 'typeengine';
const doc = createRootNode();
```

#### Insert a node
```ts
import { insertNode } from 'typeengine';
const textNode = { id: 't1', type: 'text', text: 'Hello' };
const doc2 = insertNode(doc, 'root', textNode, 0);
```

#### Remove a node
```ts
import { removeNode } from 'typeengine';
const doc3 = removeNode(doc2, 't1');
```

#### Update a node's text or attributes
```ts
import { updateNode } from 'typeengine';
const doc4 = updateNode(doc2, 't1', { text: 'World', attrs: { bold: true } });
```

#### Set or merge node attributes
```ts
import { setNodeAttributes } from 'typeengine';
const doc5 = setNodeAttributes(doc4, 't1', { italic: true });
```

#### Traverse the document tree
```ts
import { traverse } from 'typeengine';
const allNodes = traverse(doc5); // depth-first array of nodes
```

All functions throw if the target node is not found or if an operation is invalid (e.g., removing the root).

---

## Roadmap

See [`docs/roadmap.md`](./roadmap.md) for the full project roadmap and progress.

See [milestones](https://github.com/edmolima/typeengine/milestones) for detailed progress.

---

## Contributing

We welcome contributions from the community! Please open issues and pull requests. See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## License

MIT © [Edmo Lima](https://github.com/edmolima)
