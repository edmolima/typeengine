import type { SchemaValidator } from '../../src/core/validation';
import type { DocumentNode } from '../../src/core/document';

const exampleStructureValidator: SchemaValidator = {
  name: 'mustHaveHeading',
  version: '1.0.0',
  validate: (doc: DocumentNode) => {
    let hasHeading = false;
    function check(node: DocumentNode) {
      if (node.type === 'heading') hasHeading = true;
      if (node.children) node.children.forEach(check);
    }
    check(doc);
    return {
      valid: hasHeading,
      errors: hasHeading ? [] : ['Document must contain at least one heading'],
    };
  },
};

export default exampleStructureValidator;
