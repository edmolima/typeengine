import type { MigrationScript } from '../../src/core/validation';
import type { DocumentNode } from '../../src/core/document';

const exampleRestructureMigration: MigrationScript = {
  name: 'restructure',
  fromVersion: '1.0.0',
  toVersion: '2.0.0',
  migrate: (doc: DocumentNode) => {
    // Move all paragraphs under a new section node
    const paragraphs = (doc.children || []).filter(
      (n) => n.type === 'paragraph'
    );
    const others = (doc.children || []).filter((n) => n.type !== 'paragraph');
    return {
      ...doc,
      children: [
        ...others,
        {
          id: 'heading-1',
          type: 'heading',
          attrs: { level: 2 },
          children: paragraphs,
        },
      ],
    };
  },
};

export default exampleRestructureMigration;
