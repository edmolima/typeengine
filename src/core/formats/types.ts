import type { Document } from '../document';

export type Format = 'json' | 'markdown' | 'html' | string;

export interface Serializer {
  serialize(doc: Document): string;
}

export interface Deserializer {
  deserialize(str: string): Document;
}

export interface FormatPlugin {
  format: Format;
  serializer: Serializer;
  deserializer: Deserializer;
}
