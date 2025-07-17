import type { DocumentNode } from '../document';

/**
 * Serializes a DocumentNode to a JSON string.
 * @param doc The document node to serialize.
 * @returns The JSON string representation.
 */
function serialize(doc: DocumentNode): string {
  return JSON.stringify(doc);
}

/**
 * Validates if an object is a valid DocumentNode shape.
 * Throws if invalid.
 * @param obj The object to validate.
 */
function assertIsDocumentNode(obj: any): asserts obj is DocumentNode {
  if (!obj || typeof obj !== 'object')
    throw new Error('Not a DocumentNode: not an object');
  if (typeof obj.type !== 'string')
    throw new Error('Not a DocumentNode: missing type');
  if (!Array.isArray(obj.children))
    throw new Error('Not a DocumentNode: missing children');
}

/**
 * Deserializes a JSON string to a DocumentNode, with validation.
 * @param json The JSON string to parse.
 * @returns The parsed DocumentNode.
 */
function deserialize(json: string): DocumentNode {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(
      'Invalid JSON: ' + (e instanceof Error ? e.message : String(e))
    );
  }
  assertIsDocumentNode(parsed);
  return parsed;
}

export const jsonSerializer = { serialize, deserialize };
export const jsonDeserializer = jsonSerializer;
