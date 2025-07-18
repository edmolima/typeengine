import { describe, it, expect } from 'vitest';
import {
  registerValidator,
  validateDocument,
  registerMigration,
  migrateDocument,
} from '../../src/core/validation';
import exampleValidator from '../../examples/validation/example-validator';
import exampleMigration from '../../examples/migration/example-migration';
import type { DocumentNode } from '../../src/core/document';

describe('Real-world document flow', () => {
  it('validates, migrates, and revalidates a document', () => {
    registerValidator(exampleValidator);
    registerMigration(exampleMigration);
    const doc: DocumentNode = {
      id: 'root',
      type: 'root',
      children: [
        { id: 'p1', type: 'paragraph', children: [] },
        {
          id: 'p2',
          type: 'paragraph',
          children: [{ id: 't1', type: 'text', text: 'Hello' }],
        },
      ],
    };
    const result1 = validateDocument(doc, 'noEmptyParagraphs', '1.0.0');
    expect(result1.valid).toBe(false);
    expect(result1.errors).toContain('Empty paragraph found: p1');
    const migrated = migrateDocument(doc, 'addMeta', '1.0.0', '2.0.0');
    expect(migrated.attrs?.migratedAt).toBeDefined();
    const result2 = validateDocument(migrated, 'noEmptyParagraphs', '1.0.0');
    expect(result2.valid).toBe(false);
  });
});
