import { describe, it, expect } from 'vitest';
import {
  registerValidator,
  validateDocument,
  registerMigration,
  migrateDocument,
} from '../../src/core/validation';
import { loadPlugin, runTransform } from '../../src/core/plugin';
import exampleTransformPlugin from '../../examples/plugins/example-transform-plugin';
import exampleCustomNodePlugin from '../../examples/plugins/example-custom-node-plugin';
import exampleMigration from '../../examples/migration/example-migration';
import exampleRestructureMigration from '../../examples/migration/example-restructure-migration';
import type { DocumentNode } from '../../src/core/document';

describe('Multi-plugin and multi-migration flow', () => {
  it('applies multiple plugins and migrations in sequence', () => {
    loadPlugin(exampleTransformPlugin);
    loadPlugin(exampleCustomNodePlugin);
    registerMigration(exampleMigration);
    registerMigration(exampleRestructureMigration);
    const doc: DocumentNode = {
      id: 'root',
      type: 'root',
      children: [
        {
          id: 'p1',
          type: 'paragraph',
          children: [{ id: 't1', type: 'text', text: 'hello' }],
        },
        {
          id: 'p2',
          type: 'paragraph',
          children: [{ id: 't2', type: 'text', text: 'world' }],
        },
      ],
    };
    const transformed = runTransform('uppercaseText', doc);
    expect(transformed.children?.[0].children?.[0].text).toBe('HELLO');
    const withMeta = runTransform('addMetaParagraph', transformed);
    expect(withMeta.children?.some((n) => n.attrs?.meta === 'example')).toBe(
      true
    );
    const migrated = migrateDocument(withMeta, 'addMeta', '1.0.0', '2.0.0');
    expect(migrated.attrs?.migratedAt).toBeDefined();
    const restructured = migrateDocument(
      migrated,
      'restructure',
      '1.0.0',
      '2.0.0'
    );
    expect(restructured.children?.some((n) => n.type === 'heading')).toBe(true);
  });
});
