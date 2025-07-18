import {
  registerValidator,
  validateDocument,
  registerMigration,
  migrateDocument,
} from '../src/core/validation';
import type { DocumentNode } from '../src/core/document';

const largeDoc: DocumentNode = {
  id: 'root',
  type: 'root',
  children: Array.from({ length: 10000 }, (_, i) => ({
    id: 'p-' + i,
    type: 'paragraph',
    children: [{ id: 't-' + i, type: 'text', text: 'Benchmark ' + i }],
  })),
};

const validator = {
  name: 'bench',
  version: '1.0.0',
  validate: (doc: DocumentNode) => ({
    valid: Array.isArray(doc.children),
    errors: Array.isArray(doc.children) ? [] : ['No children'],
  }),
};

const migration = {
  name: 'bench',
  fromVersion: '1.0.0',
  toVersion: '2.0.0',
  migrate: (doc: DocumentNode) => ({ ...doc, migrated: true } as DocumentNode),
};

registerValidator(validator);
registerMigration(migration);

console.time('validate');
const result = validateDocument(largeDoc, 'bench', '1.0.0');
console.timeEnd('validate');
console.log('Validation result:', result);

console.time('migrate');
const migrated = migrateDocument(largeDoc, 'bench', '1.0.0', '2.0.0');
console.timeEnd('migrate');
console.log('Migrated:', !!(migrated as any).migrated);
