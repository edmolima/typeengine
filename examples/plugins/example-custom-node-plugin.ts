import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const exampleCustomNodePlugin: TypeenginePlugin = {
  name: 'customNode',
  setup(ctx: PluginContext) {
    ctx.registerSchemaExtension('paragraphWithMeta', {
      type: 'paragraph',
      fields: ['id', 'type', 'attrs', 'children', 'meta'],
    });
    ctx.registerTransform('addMetaParagraph', (doc: DocumentNode) => {
      return {
        ...doc,
        children: [
          ...(doc.children || []),
          {
            id: 'meta-1',
            type: 'paragraph',
            attrs: { meta: 'example' },
            children: [],
          },
        ],
      };
    });
  },
};

export default exampleCustomNodePlugin;
