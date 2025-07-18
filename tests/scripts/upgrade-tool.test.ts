import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { scanFile } from '../../scripts/upgrade-tool';
import { beforeEach } from 'vitest';
import { afterEach } from 'vitest';

describe('Upgrade Tool', () => {
  const samplePath = path.join(__dirname, 'sample.ts');

  beforeEach(() => {
    if (!fs.existsSync(samplePath)) {
      fs.writeFileSync(samplePath, '', 'utf8');
    }
  });

  afterEach(() => {
    if (fs.existsSync(samplePath)) {
      try {
        fs.unlinkSync(samplePath);
      } catch (e) {
        // ignore
      }
    }
  });

  it('replaces deprecated API usage with new API', () => {
    fs.writeFileSync(
      samplePath,
      'oldFunction(); legacyApi(); fooBar();',
      'utf8'
    );
    const { updated, changes } = scanFile(samplePath);
    expect(updated).toContain('newFunction');
    expect(updated).toContain('modernApi');
    expect(updated).toContain('barFoo');
    expect(changes.length).toBeGreaterThan(0);
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
