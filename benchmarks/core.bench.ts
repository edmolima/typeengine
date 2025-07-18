import { benchmark } from '../src/utils/benchmark';
import {
  traceStart,
  traceEnd,
  getTraces,
  clearTraces,
} from '../src/utils/tracing';
import { markdownSerializer } from '../src/core/formats/markdown';
import { deserializeDocument } from '../src/core/deserialize';
import { serializeDocument } from '../src/core/serialize';

const sampleMarkdown = '# Hello\n\nThis is a paragraph.\n\n- Item 1\n- Item 2';

benchmark('Markdown deserialize', () => {
  markdownSerializer.deserialize(sampleMarkdown);
});

benchmark('Markdown serialize', () => {
  const doc = markdownSerializer.deserialize(sampleMarkdown);
  markdownSerializer.serialize(doc);
});

benchmark('Core deserialize', () => {
  deserializeDocument('{"id":"root","type":"root","children":[]}', {
    format: 'json',
  });
});

benchmark('Core serialize', () => {
  serializeDocument(
    { id: 'root', type: 'root', children: [] },
    { format: 'json' }
  );
});

// Tracing example
import {
  exportResultsJSON,
  exportResultsCSV,
} from '../src/utils/exportResults';
clearTraces();
const event = traceStart('Markdown roundtrip');
const doc = markdownSerializer.deserialize(sampleMarkdown);
markdownSerializer.serialize(doc);
traceEnd(event);
console.log('Trace:', getTraces());
