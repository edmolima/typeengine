import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { scanFile } from '../../scripts/upgrade-tool';

describe('Upgrade Tool', () => {
  it('replaces deprecated API usage with new API', () => {
    const filePath = path.join(__dirname, 'sample.ts');
    fs.writeFileSync(filePath, 'oldFunction();', 'utf8');
    const { updated, changes } = scanFile(filePath);
    expect(updated).toContain('newFunction();');
    expect(changes[0]).toMatch(/Replaced oldFunction with newFunction/);
    fs.unlinkSync(filePath);
  });

  it('does not change file if no deprecated API is found', () => {
    const filePath = path.join(__dirname, 'sample.ts');
    fs.writeFileSync(filePath, 'newFunction();', 'utf8');
    const { updated, changes } = scanFile(filePath);
    expect(updated).toBe('newFunction();');
    expect(changes.length).toBe(0);
    fs.unlinkSync(filePath);
  });
});
