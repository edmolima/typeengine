import type { SchemaValidator } from '../../src/core/validation';
import type { DocumentNode } from '../../src/core/document';

const exampleValidator: SchemaValidator = {
  name: 'noEmptyParagraphs',
  version: '1.0.0',
  validate: (doc: DocumentNode) => {
    const errors: string[] = [];
    function check(node: DocumentNode) {
      if (
        node.type === 'paragraph' &&
        (!node.children || node.children.length === 0)
      ) {
        errors.push('Empty paragraph found: ' + node.id);
      }
      if (node.children) node.children.forEach(check);
    }
    check(doc);
    return { valid: errors.length === 0, errors };
  },
};

export default exampleValidator;
