/**
 * Pluggable schema validation and migration utilities for Typeengine
 * Supports versioned schemas, custom validators, and migration scripts
 * @module validation
 */
import type { DocumentNode } from './document';

export interface SchemaValidator {
  readonly name: string;
  readonly version: string;
  validate: (doc: DocumentNode) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface MigrationScript {
  readonly name: string;
  readonly fromVersion: string;
  readonly toVersion: string;
  migrate: (doc: DocumentNode) => DocumentNode;
  downgrade?: (doc: DocumentNode) => DocumentNode;
}

const validators: Record<string, SchemaValidator> = Object.create(null);
const migrations: Record<string, MigrationScript> = Object.create(null);

export function registerValidator(validator: SchemaValidator): void {
  validators[validator.name + '@' + validator.version] = validator;
}

export function validateDocument(
  doc: DocumentNode,
  name: string,
  version: string
): ValidationResult {
  const validator = validators[name + '@' + version];
  if (!validator)
    throw new Error('Validator not found: ' + name + '@' + version);
  return validator.validate(doc);
}

export function registerMigration(migration: MigrationScript): void {
  migrations[
    migration.name + '@' + migration.fromVersion + '->' + migration.toVersion
  ] = migration;
}

export function migrateDocument(
  doc: DocumentNode,
  name: string,
  fromVersion: string,
  toVersion: string
): DocumentNode {
  const migration = migrations[name + '@' + fromVersion + '->' + toVersion];
  if (!migration)
    throw new Error(
      'Migration not found: ' + name + ' ' + fromVersion + '->' + toVersion
    );
  return migration.migrate(doc);
}

export function downgradeDocument(
  doc: DocumentNode,
  name: string,
  fromVersion: string,
  toVersion: string
): DocumentNode {
  const migration = migrations[name + '@' + fromVersion + '->' + toVersion];
  if (!migration || !migration.downgrade)
    throw new Error(
      'Downgrade not supported: ' + name + ' ' + fromVersion + '->' + toVersion
    );
  return migration.downgrade(doc);
}
