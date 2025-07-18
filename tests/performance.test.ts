import { describe, it, expect } from 'vitest';
import { benchmark } from '../src/utils/benchmark';

describe('performance', () => {
  it('runs a simple benchmark', () => {
    const ms = benchmark('noop', () => {}, 100);
    expect(typeof ms).toBe('number');
    expect(ms).toBeGreaterThanOrEqual(0);
  });
});
