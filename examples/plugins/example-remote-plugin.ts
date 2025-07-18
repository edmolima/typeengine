import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const exampleRemotePlugin: TypeenginePlugin = {
  name: 'remoteTransform',
  remote: 'https://example.com/plugin/transform',
  setup(ctx: PluginContext) {
    ctx.registerTransform('remoteTransform', async (doc: DocumentNode) => {
      // Simulate remote transform (stub)
      return { ...doc, attrs: { ...doc.attrs, remote: true } };
    });
  },
};

export default exampleRemotePlugin;
