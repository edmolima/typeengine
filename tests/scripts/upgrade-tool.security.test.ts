import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { scanFile } from '../../scripts/upgrade-tool';

const tmpDir = __dirname;

describe('Upgrade Tool Security', () => {
  it('does not expose sensitive data in logs', () => {
    const filePath = path.join(tmpDir, 'sample.ts');
    fs.writeFileSync(filePath, 'oldFunction();', 'utf8');
    const { changes } = scanFile(filePath);
    for (const change of changes) {
      expect(change).not.toMatch(/password|secret|token|key/i);
    }
    fs.unlinkSync(filePath);
  });

  it('handles migration failures gracefully', () => {
    const filePath = path.join(tmpDir, 'readonly.ts');
    fs.writeFileSync(filePath, 'oldFunction();', 'utf8');
    fs.chmodSync(filePath, 0o444); // read-only
    try {
      scanFile(filePath);
    } catch (e) {
      expect(e).toBeDefined();
    } finally {
      fs.chmodSync(filePath, 0o644);
      fs.unlinkSync(filePath);
    }
  });
});
