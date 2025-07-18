// Utility to export benchmark and trace results to JSON or CSV
import fs from 'fs';

export function exportResultsJSON(path: string, data: any) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export function exportResultsCSV(
  path: string,
  rows: Array<Record<string, any>>
) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(',')]
    .concat(
      rows.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
      )
    )
    .join('\n');
  fs.writeFileSync(path, csv);
}
