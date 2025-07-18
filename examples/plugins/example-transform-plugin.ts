import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const exampleTransformPlugin: TypeenginePlugin = {
  name: 'uppercaseText',
  setup(ctx: PluginContext) {
    ctx.registerTransform('uppercaseText', (doc: DocumentNode) => {
      function transform(node: DocumentNode): DocumentNode {
        if (node.type === 'text' && node.text) {
          return { ...node, text: node.text.toUpperCase() };
        }
        if (node.children) {
          return { ...node, children: node.children.map(transform) };
        }
        return node;
      }
      return transform(doc);
    });
  },
};

export default exampleTransformPlugin;
