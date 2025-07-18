import { describe, it, expect } from 'vitest';
import {
  exportResultsJSON,
  exportResultsCSV,
} from '../../src/utils/exportResults';
import fs from 'fs';

const tmpJson = 'tmp-bench.json';
const tmpCsv = 'tmp-bench.csv';

describe('exportResults', () => {
  it('exports results to JSON', () => {
    const data = [{ label: 'test', ms: 1.23, iterations: 10 }];
    exportResultsJSON(tmpJson, data);
    const content = fs.readFileSync(tmpJson, 'utf8');
    expect(JSON.parse(content)).toEqual(data);
    fs.unlinkSync(tmpJson);
  });

  it('exports results to CSV', () => {
    const rows = [
      { label: 'bench', ms: 2.34, iterations: 20 },
      { label: 'other', ms: 3.45, iterations: 30 },
    ];
    exportResultsCSV(tmpCsv, rows);
    const content = fs.readFileSync(tmpCsv, 'utf8');
    expect(content).toContain('label,ms,iterations');
    expect(content).toContain('bench');
    expect(content).toContain('other');
    fs.unlinkSync(tmpCsv);
  });
});
