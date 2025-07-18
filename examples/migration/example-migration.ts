import type { MigrationScript } from '../../src/core/validation';
import type { DocumentNode } from '../../src/core/document';

const exampleMigration: MigrationScript = {
  name: 'addMeta',
  fromVersion: '1.0.0',
  toVersion: '2.0.0',
  migrate: (doc: DocumentNode) => ({
    ...doc,
    attrs: { ...doc.attrs, migratedAt: Date.now() },
  }),
  downgrade: (doc: DocumentNode) => {
    const attrs = { ...doc.attrs };
    delete attrs.migratedAt;
    return { ...doc, attrs };
  },
};

export default exampleMigration;
