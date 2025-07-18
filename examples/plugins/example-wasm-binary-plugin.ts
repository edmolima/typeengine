import type { TypeenginePlugin, PluginContext } from '../../src/core/plugin';
import type { DocumentNode } from '../../src/core/document';

// Minimal WASM binary stub (would be replaced with a real .wasm file in production)
const wasmBinary = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
]);

const exampleWasmBinaryPlugin: TypeenginePlugin = {
  name: 'wasmBinaryTransform',
  wasm: wasmBinary as any,
  setup(ctx: PluginContext) {
    ctx.registerTransform('wasmBinaryTransform', (doc: DocumentNode) => {
      // Simulate WASM transform (stub)
      return { ...doc, attrs: { ...doc.attrs, wasmBinary: true } };
    });
  },
};

export default exampleWasmBinaryPlugin;
