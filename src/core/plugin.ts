/**
 * Universal plugin system for Typeengine
 * Supports runtime, compile-time, and WASM/remote plugins
 *
 * @module plugin
 */
import type { DocumentNode } from './document';

/**
 * Context passed to plugin setup for registration of transforms and schema extensions.
 */
export interface PluginContext {
  registerTransform: (
    name: string,
    fn: (
      doc: DocumentNode,
      ...args: unknown[]
    ) => DocumentNode | Promise<DocumentNode>
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
  plugin.setup({
    registerTransform: (name, fn) => {
      transforms[name] = fn;
    },
    registerSchemaExtension: (name, schema) => {
      schemaExtensions[name] = schema;
    },
    permissions: plugin.permissions ?? [],
  });
  loadedPlugins = [...loadedPlugins, plugin];
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
