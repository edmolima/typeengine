import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  applyTransform,
  replayTransforms,
  auditLog,
  Transform,
} from '../../src/core/transform';
import { createRootNode } from '../../src/core/document';
import { markdownSerializer } from '../../src/core/formats/markdown';
import { htmlSerializer } from '../../src/core/formats/html';
import { jsonSerializer } from '../../src/core/formats/json';

describe('Deterministic transforms', () => {
  it('produces same result for same input (json)', () => {
    const doc = createRootNode([]);
    const t: Transform = {
      op: 'insert',
      payload: { id: 'a', type: 'paragraph' },
    };
    const result1 = applyTransform(doc, t);
    const result2 = applyTransform(doc, t);
    expect(jsonSerializer.serialize(result1)).toEqual(
      jsonSerializer.serialize(result2)
    );
  });

  it('produces same result for same input (markdown)', () => {
    const doc = createRootNode([]);
    const t: Transform = {
      op: 'insert',
      payload: { id: 'a', type: 'paragraph' },
    };
    const result1 = applyTransform(doc, t);
    const result2 = applyTransform(doc, t);
    expect(markdownSerializer.serialize(result1)).toEqual(
      markdownSerializer.serialize(result2)
    );
  });

  it('produces same result for same input (html)', () => {
    const doc = createRootNode([]);
    const t: Transform = {
      op: 'insert',
      payload: { id: 'a', type: 'paragraph' },
    };
    const result1 = applyTransform(doc, t);
    const result2 = applyTransform(doc, t);
    expect(htmlSerializer.serialize(result1)).toEqual(
      htmlSerializer.serialize(result2)
    );
  });

  it('replay reconstructs document history accurately (json)', () => {
    const doc = createRootNode([]);
    const transforms: Transform[] = [
      { op: 'insert', payload: { id: 'a', type: 'paragraph' } },
      { op: 'update', payload: { id: 'a', type: 'heading' } },
      { op: 'remove', payload: { id: 'a' } },
    ];
    const replayed = replayTransforms(doc, transforms);
    expect(jsonSerializer.serialize(replayed)).toEqual(
      jsonSerializer.serialize(createRootNode([]))
    );
  });

  it('replay reconstructs document history accurately (markdown)', () => {
    const doc = createRootNode([]);
    const transforms: Transform[] = [
      { op: 'insert', payload: { id: 'a', type: 'paragraph' } },
      { op: 'update', payload: { id: 'a', type: 'heading' } },
      { op: 'remove', payload: { id: 'a' } },
    ];
    const replayed = replayTransforms(doc, transforms);
    expect(markdownSerializer.serialize(replayed)).toEqual(
      markdownSerializer.serialize(createRootNode([]))
    );
  });

  it('replay reconstructs document history accurately (html)', () => {
    const doc = createRootNode([]);
    const transforms: Transform[] = [
      { op: 'insert', payload: { id: 'a', type: 'paragraph' } },
      { op: 'update', payload: { id: 'a', type: 'heading' } },
      { op: 'remove', payload: { id: 'a' } },
    ];
    const replayed = replayTransforms(doc, transforms);
    expect(htmlSerializer.serialize(replayed)).toEqual(
      htmlSerializer.serialize(createRootNode([]))
    );
  });

  it('audit log is complete and verifiable', () => {
    const transforms: Transform[] = [
      {
        op: 'insert',
        payload: { id: 'a', type: 'paragraph' },
        timestamp: 1,
        userId: 'u1',
      },
      {
        op: 'update',
        payload: { id: 'a', type: 'heading' },
        timestamp: 2,
        userId: 'u2',
      },
    ];
    const log = auditLog(transforms);
    expect(log).toContain('insert');
    expect(log).toContain('update');
    expect(log).toContain('u1');
    expect(log).toContain('u2');
  });

  it('is robust to malformed or malicious input', () => {
    const doc = createRootNode([]);
    expect(() => applyTransform(doc, { op: 'unknown', payload: {} })).toThrow();
    expect(() =>
      applyTransform(createRootNode([]), {
        op: 'insert',
        payload: { id: 123, type: 'paragraph' },
      })
    ).toThrow();
  });

  it('is deterministic under property-based mutation (json)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            op: fc.constantFrom('insert', 'remove', 'update'),
            payload: fc.record({
              id: fc.string(),
              type: fc.constantFrom('paragraph', 'heading', 'code'),
            }),
          })
        ),
        (transforms) => {
          const doc = createRootNode([]);
          const replay1 = replayTransforms(doc, transforms);
          const replay2 = replayTransforms(doc, transforms);
          expect(jsonSerializer.serialize(replay1)).toEqual(
            jsonSerializer.serialize(replay2)
          );
        }
      )
    );
  });

  it('is deterministic under property-based mutation (markdown)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            op: fc.constantFrom('insert', 'remove', 'update'),
            payload: fc.record({
              id: fc.string(),
              type: fc.constantFrom('paragraph', 'heading', 'code'),
            }),
          })
        ),
        (transforms) => {
          const doc = createRootNode([]);
          const replay1 = replayTransforms(doc, transforms);
          const replay2 = replayTransforms(doc, transforms);
          expect(markdownSerializer.serialize(replay1)).toEqual(
            markdownSerializer.serialize(replay2)
          );
        }
      )
    );
  });

  it('is deterministic under property-based mutation (html)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            op: fc.constantFrom('insert', 'remove', 'update'),
            payload: fc.record({
              id: fc.string(),
              type: fc.constantFrom('paragraph', 'heading', 'code'),
            }),
          })
        ),
        (transforms) => {
          const doc = createRootNode([]);
          const replay1 = replayTransforms(doc, transforms);
          const replay2 = replayTransforms(doc, transforms);
          expect(htmlSerializer.serialize(replay1)).toEqual(
            htmlSerializer.serialize(replay2)
          );
        }
      )
    );
  });

  it('replay reconstructs document history accurately', () => {
    const doc = createRootNode([]);
    const transforms: Transform[] = [
      { op: 'insert', payload: { id: 'a', type: 'paragraph' } },
      { op: 'update', payload: { id: 'a', type: 'heading' } },
      { op: 'remove', payload: { id: 'a' } },
    ];
    const replayed = replayTransforms(doc, transforms);
    expect(replayed.children?.length ?? 0).toBe(0);
  });

  it('audit log is complete and verifiable', () => {
    const transforms: Transform[] = [
      {
        op: 'insert',
        payload: { id: 'a', type: 'paragraph' },
        timestamp: 1,
        userId: 'u1',
      },
      {
        op: 'update',
        payload: { id: 'a', type: 'heading' },
        timestamp: 2,
        userId: 'u2',
      },
    ];
    const log = auditLog(transforms);
    expect(log).toContain('insert');
    expect(log).toContain('update');
    expect(log).toContain('u1');
    expect(log).toContain('u2');
  });

  it('is robust to malformed or malicious input', () => {
    const doc = createRootNode([]);
    expect(() => applyTransform(doc, { op: 'unknown', payload: {} })).toThrow();
  });

  it('is deterministic under property-based mutation', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            op: fc.constantFrom('insert', 'remove', 'update'),
            payload: fc.record({
              id: fc.string(),
              type: fc.constantFrom('paragraph', 'heading', 'code'),
            }),
          })
        ),
        (transforms) => {
          const doc = createRootNode([]);
          const replay1 = replayTransforms(doc, transforms);
          const replay2 = replayTransforms(doc, transforms);
          expect(replay1).toEqual(replay2);
        }
      )
    );
  });
});
