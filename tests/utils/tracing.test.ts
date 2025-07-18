import { describe, it, expect } from 'vitest';
import {
  traceStart,
  traceEnd,
  getTraces,
  clearTraces,
} from '../../src/utils/tracing';

describe('tracing', () => {
  it('records trace events', () => {
    clearTraces();
    const event = traceStart('test');
    setTimeout(() => {
      traceEnd(event);
      const traces = getTraces();
      expect(traces.length).toBe(1);
      expect(traces[0].label).toBe('test');
      expect(traces[0].duration).toBeGreaterThanOrEqual(0);
    }, 10);
  });
});
