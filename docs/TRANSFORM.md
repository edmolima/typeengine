# Deterministic Transforms in Typeengine

Deterministic transforms ensure document changes are predictable, testable, and auditable. All transform operations are pure functions: same input yields same output, with no side effects or hidden state.

## API

- `applyTransform(doc, transform)` — Applies a single transform operation to a document node.
- `replayTransforms(initial, transforms)` — Replays a sequence of transforms to reconstruct document history.
- `auditLog(transforms)` — Produces a complete, verifiable log of all transforms.

## Guarantees

- All transforms are deterministic and pure
- Replay reconstructs document history accurately
- Audit logs are complete and verifiable
- Handles malformed/malicious input safely
- O(n) performance in document size/history

## Usage Example

```ts
  import { applyTransform, replayTransforms, auditLog } from 'typeengine/core/transform';

  const doc = { type: 'root', children: [] };
  const transforms = [
    { op: 'insert', payload: { id: 'a', type: 'paragraph' } },
    { op: 'update', payload: { id: 'a', type: 'heading' } },
    { op: 'remove', payload: { id: 'a' } },
  ];

  const replayed = replayTransforms(doc, transforms);
  console.log(replayed);
  console.log(auditLog(transforms));
```
