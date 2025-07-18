import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

const exampleWasmPlugin: TypeenginePlugin = {
  name: 'wasmTransform',
  wasm: null, // Stub for WASM module
  setup(ctx: PluginContext) {
    ctx.registerTransform('wasmTransform', (doc: DocumentNode) => {
      // Simulate WASM transform (stub)
      return { ...doc, attrs: { ...doc.attrs, wasm: true } };
    });
  },
};

export default exampleWasmPlugin;
