import type { Document } from './document';
import { Format, FormatPlugin } from './formats/types';
import { jsonDeserializer } from './formats/json';
import { markdownSerializer } from './formats/markdown';
import { htmlDeserializer } from './formats/html';

const builtInDeserializers: Record<string, (str: string) => Document> = {
  json: jsonDeserializer.deserialize,
  markdown: markdownSerializer.deserialize,
  html: htmlDeserializer.deserialize,
};

export function deserializeDocument(
  str: string,
  opts: { format: Format; plugins?: FormatPlugin[] }
): Document {
  const { format, plugins } = opts;
  const plugin = plugins?.find((p) => p.format === format);
  if (plugin) return plugin.deserializer.deserialize(str);
  const deserializer = builtInDeserializers[format];
  if (!deserializer) throw new Error(`Unknown format: ${format}`);
  return deserializer(str);
}
