# Universal Plugin System for Typeengine

Typeengine plugins allow developers to extend and customize the document engine at runtime, compile-time, or via WASM/remote modules.

## API

- `loadPlugin(plugin)` — Loads a plugin and registers its transforms/schema extensions
- `unloadPlugin(name)` — Unloads a plugin by name
- `runTransform(name, doc, ...args)` — Runs a registered transform
- `getSchemaExtension(name)` — Retrieves a registered schema extension
- `getLoadedPlugins()` — Lists all loaded plugins

## Example Plugin

```ts
import { loadPlugin } from 'typeengine/core/plugin';

loadPlugin({
  name: 'my-plugin',
  setup: (ctx) => {
    ctx.registerTransform('addHeading', (doc) => ({
      ...doc,
      children: [...(doc.children ?? []), { id: 'h1', type: 'heading', attrs: { level: 1 } }],
    }));
    ctx.registerSchemaExtension('customBlock', { type: 'custom', attrs: { foo: 'bar' } });
  },
});
```

## WASM/Remote Plugins

- Plugins can provide a `wasm` (WebAssembly.Module) or `remote` (URL) property for advanced use cases.
- Permission model and sandboxing are enforced for security.

## Guarantees

- Plugins are sandboxed and permissioned
- All plugin hooks are covered by tests
- Minimal overhead and no impact on core document operations
