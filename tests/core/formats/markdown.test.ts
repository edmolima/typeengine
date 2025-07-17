import { describe, it, expect } from 'vitest';
import { markdownSerializer } from '../../../src/core/formats/markdown';

describe('markdownSerializer', () => {
  it('serializes to markdown stub', () => {
    expect(markdownSerializer.serialize({} as any)).toContain(
      'Document exported as Markdown'
    );
  });

  it('throws on deserialize (not implemented)', () => {
    expect(() => markdownSerializer.deserialize('')).toThrow('not implemented');
  });
});
