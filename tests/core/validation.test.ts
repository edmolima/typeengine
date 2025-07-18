import { describe, it, expect } from 'vitest';
import {
  registerValidator,
  validateDocument,
  registerMigration,
  migrateDocument,
  downgradeDocument,
} from '../../src/core/validation';
import type { DocumentNode } from '../../src/core/document';

describe('Schema Validation and Migration', () => {
  const validDoc: DocumentNode = {
    id: 'doc-1',
    type: 'root',
    children: [],
  };
  const validDocMigrated: DocumentNode = {
    id: 'doc-1',
    type: 'root',
    children: [],
    // @ts-ignore for test extension
    migrated: true,
  };
  const simpleValidator = {
    name: 'simple',
    version: '1.0.0',
    validate: (doc: DocumentNode) => ({
      valid: !!doc && typeof doc === 'object' && doc.type === 'root',
      errors: !doc
        ? ['Document is null']
        : doc.type !== 'root'
        ? ['Invalid type']
        : [],
    }),
  };

  const migrationScript = {
    name: 'simple',
    fromVersion: '1.0.0',
    toVersion: '2.0.0',
    migrate: (doc: DocumentNode) =>
      ({ ...doc, migrated: true } as DocumentNode),
    downgrade: (doc: DocumentNode) =>
      ({ ...doc, migrated: false } as DocumentNode),
  };

  it('registers and runs a validator', () => {
    registerValidator(simpleValidator);
    const result = validateDocument(validDoc, 'simple', '1.0.0');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails validation for malformed document', () => {
    const result = validateDocument(null as any, 'simple', '1.0.0');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Document is null');
  });

  it('registers and runs a migration', () => {
    registerMigration(migrationScript);
    const migrated = migrateDocument(
      validDoc,
      'simple',
      '1.0.0',
      '2.0.0'
    ) as any;
    expect(migrated.migrated).toBe(true);
  });

  it('runs a downgrade migration', () => {
    const downgraded = downgradeDocument(
      validDocMigrated as any,
      'simple',
      '1.0.0',
      '2.0.0'
    ) as any;
    expect(downgraded.migrated).toBe(false);
  });

  it('throws for missing validator', () => {
    expect(() => validateDocument(validDoc, 'missing', '1.0.0')).toThrow();
  });

  it('throws for missing migration', () => {
    expect(() =>
      migrateDocument(validDoc, 'missing', '1.0.0', '2.0.0')
    ).toThrow();
  });

  it('throws for missing downgrade', () => {
    expect(() =>
      downgradeDocument(validDoc, 'simple', '2.0.0', '1.0.0')
    ).toThrow();
  });
});
