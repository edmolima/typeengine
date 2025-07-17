import { describe, it, expect } from 'vitest';
import * as typeengine from '../src/index';

describe('index.ts (entrypoint)', () => {
  it('should export all main API symbols', () => {
    expect(typeengine).toHaveProperty('createRootNode');
    expect(typeengine).toHaveProperty('insertNode');
    expect(typeengine).toHaveProperty('removeNode');
    expect(typeengine).toHaveProperty('updateNode');
    expect(typeengine).toHaveProperty('setNodeAttributes');
  });

  it('should allow calling a core function', () => {
    const root = typeengine.createRootNode([]);
    expect(root).toHaveProperty('id');
    expect(root).toHaveProperty('type', 'root');
    expect(Array.isArray(root.children)).toBe(true);
  });
});
