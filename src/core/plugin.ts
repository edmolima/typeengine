/**
 * @apiVersion 1.0.0
 * @deprecated Use new plugin API in future versions
 */
/**
 * Universal plugin system for Typeengine
 * Supports runtime, compile-time, and WASM/remote plugins
 *
 * @module plugin
 */
import type { DocumentNode } from './document';
import { notifyPluginObservers } from './observability';

/**
 * Context passed to plugin setup for registration of transforms and schema extensions.
 */
export interface PluginContext {
  registerTransform: (
    name: string,
    fn: (
      doc: DocumentNode,
      ...args: unknown[]
    ) => DocumentNode | Promise<DocumentNode>,
    opts?: { permissions?: string[]; sandbox?: boolean }
  ) => void;
  registerSchemaExtension: (name: string, schema: unknown) => void;
  permissions?: readonly string[];
}

/**
 * TypeenginePlugin describes a plugin for document transforms and schema extensions.
 */
export interface TypeenginePlugin {
  readonly name: string;
  readonly setup: (ctx: PluginContext) => void;
  readonly wasm?: WebAssembly.Module | null;
  readonly remote?: string;
  readonly permissions?: readonly string[];
}

/**
 * Internal registry for transforms and schema extensions.
 */
const transforms: Record<
  string,
  (
    doc: DocumentNode,
    ...args: unknown[]
  ) => DocumentNode | Promise<DocumentNode>
> = Object.create(null);
const schemaExtensions: Record<string, unknown> = Object.create(null);
let loadedPlugins: ReadonlyArray<TypeenginePlugin> = [];

/**
 * Loads a plugin and registers its transforms and schema extensions.
 * @param plugin - The plugin to load
 */
export function loadPlugin(plugin: TypeenginePlugin): void {
  // Harden plugin setup with permission enforcement and sandboxing
  plugin.setup({
    registerTransform: (name, fn, opts) => {
      transforms[name] = async (doc, ...args) => {
        // Permission enforcement
        const required = opts?.permissions || plugin.permissions || [];
        if (required.length && !hasPermissions(plugin, Array.from(required))) {
          throw new Error(
            `Plugin '${
              plugin.name
            }' lacks required permissions: ${required.join(', ')}`
          );
        }
        // WASM sandbox support
        if (opts?.sandbox && plugin.wasm) {
          // Example: run transform in WASM sandbox (pseudo-code)
          // return await runWasmTransform(plugin.wasm, name, doc, ...args);
          throw new Error('WASM sandboxing not yet implemented');
        }
        // Error boundary
        try {
          const start = performance.now();
          let result;
          try {
            result = fn(doc, ...args);
            result = result instanceof Promise ? await result : result;
            notifyPluginObservers({
              plugin: plugin.name,
              transform: name,
              status: 'success',
              duration: performance.now() - start,
            });
            return result;
          } catch (err) {
            notifyPluginObservers({
              plugin: plugin.name,
              transform: name,
              status: 'error',
              duration: performance.now() - start,
              error: err,
            });
            throw err;
          }
        } catch (err) {
          // Log and rethrow for observability
          logPluginError(plugin.name, name, err);
          throw err;
        }
      };
    },
    registerSchemaExtension: (name, schema) => {
      schemaExtensions[name] = schema;
    },
    permissions: plugin.permissions ?? [],
  });
  loadedPlugins = [...loadedPlugins, plugin];
  // Permission enforcement helper
  function hasPermissions(
    plugin: TypeenginePlugin,
    required: string[]
  ): boolean {
    const granted = plugin.permissions || [];
    return required.every((perm) => granted.includes(perm));
  }

  // Error logging for observability
  function logPluginError(
    pluginName: string,
    transformName: string,
    err: unknown
  ) {
    // Integrate with external monitoring/metrics here
    // For now, just log to console
    console.error(
      `[PluginError] Plugin: ${pluginName}, Transform: ${transformName}, Error:`,
      err
    );
  }
}

/**
 * Unloads a plugin by name.
 * @param name - The plugin name
 */
export function unloadPlugin(name: string): void {
  loadedPlugins = loadedPlugins.filter((p) => p.name !== name);
}

/**
 * Runs a registered transform by name.
 * @param name - Transform name
 * @param doc - Document node
 * @param args - Additional arguments
 * @returns Transformed document node
 */
export async function runTransform(
  name: string,
  doc: DocumentNode,
  ...args: unknown[]
): Promise<DocumentNode> {
  const fn = transforms[name];
  if (typeof fn !== 'function') throw new Error('Transform not found: ' + name);
  const result = fn(doc, ...args);
  return result instanceof Promise ? await result : result;
}

/**
 * Retrieves a registered schema extension by name.
 * @param name - Extension name
 * @returns The schema extension or undefined
 */
export function getSchemaExtension(name: string): unknown {
  return schemaExtensions[name];
}

/**
 * Returns all currently loaded plugins.
 * @returns Array of loaded plugins
 */
export function getLoadedPlugins(): ReadonlyArray<TypeenginePlugin> {
  return loadedPlugins;
}
