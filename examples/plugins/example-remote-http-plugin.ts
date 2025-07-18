import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const exampleRemoteHttpPlugin: TypeenginePlugin = {
  name: 'remoteHttpTransform',
  remote: 'https://api.example.com/transform',
  setup(ctx: PluginContext) {
    ctx.registerTransform('remoteHttpTransform', async (doc: DocumentNode) => {
      // Example: POST document to remote API and return result
      const response = await fetch('https://api.example.com/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (!response.ok) throw new Error('Remote transform failed');
      return await response.json();
    });
  },
};

export default exampleRemoteHttpPlugin;
