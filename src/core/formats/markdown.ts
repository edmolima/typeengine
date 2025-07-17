import type { Document } from '../document';

export const markdownSerializer = {
  serialize(_doc: Document): string {
    return '# [Document exported as Markdown]';
  },
  deserialize(_md: string): Document {
    throw new Error('Markdown deserialization not implemented');
  },
};
