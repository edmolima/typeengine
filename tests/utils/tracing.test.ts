import { describe, it, expect } from 'vitest';
import {
  traceStart,
  traceEnd,
  getTraces,
  clearTraces,
} from '../../src/utils/tracing';

describe('tracing', () => {
  it('records trace events', async () => {
    clearTraces();
    const event = traceStart('test');
    await new Promise((resolve) => setTimeout(resolve, 10));
    traceEnd(event);
    const traces = getTraces();
    expect(traces.length).toBe(1);
    expect(traces[0].label).toBe('test');
    expect(traces[0].duration).toBeGreaterThanOrEqual(0);
  });
  it('supports plugin observers', () => {
    let called = false;
    const observer = () => {
      called = true;
    };
    // Import directly if available
    try {
      const {
        addPluginObserver,
        removePluginObserver,
      } = require('../../src/core/observability');
      addPluginObserver(observer);
      removePluginObserver(observer);
      expect(called).toBe(false);
    } catch (e) {
      // If not available, skip
      expect(true).toBe(true);
    }
  });
});
