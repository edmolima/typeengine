import { describe, it, expect } from 'vitest';
import { benchmark } from '../../src/utils/benchmark';

describe('benchmark', () => {
  it('runs and returns a number', () => {
    const ms = benchmark('noop', () => {}, 10);
    expect(typeof ms).toBe('number');
    expect(ms).toBeGreaterThanOrEqual(0);
  });
});
