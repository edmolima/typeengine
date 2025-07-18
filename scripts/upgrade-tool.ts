#!/usr/bin/env ts-node
/**
 * Upgrade Tool for Typeengine
 * Detects deprecated/changed APIs and suggests migration steps
 * DRY, immutable, ATDD style
 *
 * Usage:
 *   pnpm ts-node scripts/upgrade-tool.ts
 *
 * What it does:
 *   - Scans all .ts/.tsx files for deprecated API patterns
 *   - Applies codemod rules (see deprecatedAPIs array)
 *   - Prints a summary of changes
 *
 * How to extend:
 *   - Add new rules to deprecatedAPIs: { old, replacement, message }
 *   - Run the tool again to apply new migrations
 *
 * Example rules:
 *   { old: 'legacyApi', replacement: 'modernApi', message: 'Use modernApi instead.' }
 *   { old: 'import { x } from "typeengine/core";', replacement: 'import { x } from "typeengine";', message: 'Use root entrypoint.' }
 */
import fs from 'fs';
import path from 'path';

const deprecatedAPIs = [
  {
    old: 'oldFunction',
    replacement: 'newFunction',
    message: 'Use newFunction instead of oldFunction.',
  },
  {
    old: 'legacyApi',
    replacement: 'modernApi',
    message: 'Use modernApi instead of legacyApi.',
  },
  {
    old: 'fooBar',
    replacement: 'barFoo',
    message: 'Use barFoo instead of fooBar.',
  },
  {
    old: 'import { something } from "typeengine/core";',
    replacement: 'import { something } from "typeengine";',
    message: 'Import from typeengine root entrypoint.',
  },
];

export function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  let changes: string[] = [];
  for (const api of deprecatedAPIs) {
    if (content.includes(api.old)) {
      updated = updated.replace(new RegExp(api.old, 'g'), api.replacement);
      changes.push(
        `Replaced ${api.old} with ${api.replacement} in ${filePath}`
      );
    }
  }
  return { updated, changes };
}

function scanProject(root: string) {
  const files = fs.readdirSync(root);
  let allChanges: string[] = [];
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const filePath = path.join(root, file);
      const { updated, changes } = scanFile(filePath);
      if (changes.length) {
        fs.writeFileSync(filePath, updated, 'utf8');
        allChanges.push(...changes);
      }
    }
  }
  return allChanges;
}

if (require.main === module) {
  const changes = scanProject(path.resolve(__dirname, '../src'));
  if (changes.length) {
    console.log('Upgrade changes applied:');
    for (const change of changes) console.log(change);
    process.exit(0);
  } else {
    console.log('No deprecated APIs found. Project is up to date.');
    process.exit(0);
  }
}
