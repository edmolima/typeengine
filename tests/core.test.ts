import { describe, it, expect } from 'vitest';
import { helloWorld } from '../src/index';

describe('helloWorld', () => {
  it('returns the correct string', () => {
    expect(helloWorld()).toBe('Hello, typeengine!');
  });
});
