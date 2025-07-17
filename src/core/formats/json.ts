import type { DocumentNode } from '../document';

export const jsonSerializer = {
  serialize(doc: DocumentNode): string {
    return JSON.stringify(doc);
  },
  deserialize(json: string): DocumentNode {
    const parsed = JSON.parse(json);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.type !== 'string' ||
      !Array.isArray(parsed.children)
    ) {
      throw new Error('Not a DocumentNode');
    }
    return parsed;
  },
};

export const jsonDeserializer = jsonSerializer;
