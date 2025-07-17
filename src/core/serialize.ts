import type { DocumentNode } from './document';
import { Format, FormatPlugin } from './formats/types';
import { jsonSerializer } from './formats/json';
import { markdownSerializer } from './formats/markdown';
import { htmlSerializer } from './formats/html';

const builtInSerializers: Record<string, (doc: DocumentNode) => string> = {
  json: jsonSerializer.serialize,
  markdown: markdownSerializer.serialize,
  html: htmlSerializer.serialize,
};

export function serializeDocument(
  doc: DocumentNode,
  opts: { format: Format; plugins?: FormatPlugin[] }
): string {
  const { format, plugins } = opts;
  const plugin = plugins?.find((p) => p.format === format);
  if (plugin) return plugin.serializer.serialize(doc);
  const serializer = builtInSerializers[format];
  if (!serializer) throw new Error(`Unknown format: ${format}`);
  return serializer(doc);
}
