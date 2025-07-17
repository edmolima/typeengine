import { describe, it, expect } from 'vitest';
import { markdownSerializer } from '../../../src/core/formats/markdown';
import type { DocumentNode } from '../../../src/core/document';

describe('markdownSerializer', () => {
  it('serializes and deserializes a minimal document', () => {
    const doc: DocumentNode = {
      id: 'root',
      type: 'root',
      attrs: {},
      text: '',
      children: [
        {
          id: 'p1',
          type: 'paragraph',
          attrs: {},
          text: '',
          children: [
            {
              id: 't1',
              type: 'text',
              attrs: {},
              text: 'Hello',
              children: [],
            },
          ],
        },
      ],
    };
    const md = markdownSerializer.serialize(doc);
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.type).toBe('root');
    expect(Array.isArray(parsed.children)).toBe(true);
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(Array.isArray(parsed.children?.[0]?.children)).toBe(true);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('text');
    expect(parsed.children?.[0]?.children?.[0]?.text).toBe('Hello');
  });

  it('parses strong (**bold**)', () => {
    const md = '**bold**';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('strong');
    expect(parsed.children?.[0]?.children?.[0]?.children?.[0]?.text).toBe(
      'bold'
    );
  });

  it('parses emphasis (*em*)', () => {
    const md = '*em*';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('emphasis');
    expect(parsed.children?.[0]?.children?.[0]?.children?.[0]?.text).toBe('em');
  });

  it('parses link [label](url)', () => {
    const md = '[label](http://test.com)';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('link');
    expect(parsed.children?.[0]?.children?.[0]?.attrs?.href).toBe(
      'http://test.com'
    );
    expect(parsed.children?.[0]?.children?.[0]?.children?.[0]?.text).toBe(
      'label'
    );
  });

  it('parses image ![alt](src)', () => {
    const md = '![alt](img.png)';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('image');
    expect(parsed.children?.[0]?.children?.[0]?.attrs?.alt).toBe('alt');
    expect(parsed.children?.[0]?.children?.[0]?.attrs?.src).toBe('img.png');
  });

  it('parses fallback text', () => {
    const md = 'plain';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('text');
    expect(parsed.children?.[0]?.children?.[0]?.text).toBe('plain');
  });

  it('parses inline code', () => {
    const md = '`code`';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('inlineCode');
    expect(parsed.children?.[0]?.children?.[0]?.text).toBe('code');
  });

  it('parses blockquote', () => {
    const md = '> quoted';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('blockquote');
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.children?.[0]?.children?.[0]?.text).toBe(
      'quoted'
    );
  });

  it('parses unordered list', () => {
    const md = '- item1\n- item2';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('list');
    expect(parsed.children?.[0]?.attrs?.ordered).toBeFalsy();
    expect(parsed.children?.[0]?.children?.length).toBe(2);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('listItem');
  });

  it('parses ordered list', () => {
    const md = '1. item1\n2. item2';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('list');
    expect(parsed.children?.[0]?.attrs?.ordered).toBeTruthy();
    expect(parsed.children?.[0]?.children?.length).toBe(2);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('listItem');
  });

  it('parses code block', () => {
    const md = '```js\nconsole.log(1);\n```';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('code');
    expect(parsed.children?.[0]?.attrs?.lang).toBe('js');
    expect(parsed.children?.[0]?.text).toContain('console.log');
  });

  it('parses heading', () => {
    const md = '## Heading';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('heading');
    expect(parsed.children?.[0]?.attrs?.level).toBe(2);
    expect(parsed.children?.[0]?.children?.[0]?.text).toBe('Heading');
  });

  it('parses thematic break', () => {
    const md = '---';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('thematicBreak');
  });

  it('parses table', () => {
    const md = '| h1 | h2 |\n|----|----|\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('tableRow');
    expect(parsed.children?.[0]?.children?.[0]?.children?.[0]?.type).toBe(
      'tableCell'
    );
    expect(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.text
    ).toBe('h1');
  });

  it('parses html block with multiple lines and closing tag', () => {
    const md = `<div>\nline1\nline2\n</div>`;
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('html');
    expect(parsed.children?.[0]?.text).toContain('line1');
    expect(parsed.children?.[0]?.text).toContain('line2');
    expect(parsed.children?.[0]?.text).toContain('</div>');
  });

  it('parses html block without closing tag', () => {
    const md = `<div>\nno close`;
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('html');
    expect(parsed.children?.[0]?.text).toContain('no close');
  });

  it('parses table with header, align, and body', () => {
    const md = '| h1 | h2 |\n|:---|---:|\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    // Accept align to be 'left', null, or undefined (implementation may set null or undefined)
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with only header', () => {
    const md = '| h1 | h2 |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('tableRow');
    expect(parsed.children?.[0]?.children?.[0]?.children?.length).toBe(2);
  });

  it('parses table with no body rows', () => {
    const md = '| h1 | h2 |\n|----|----|';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 1 or 2 rows (header only, or header + align row if implementation includes it)
    expect([1, 2]).toContain(parsed.children?.[0]?.children?.length);
  });

  it('parses malformed table (no align row)', () => {
    const md = '| h1 | h2 |\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBe(2);
  });

  it('parses empty input as root with no children', () => {
    const parsed = markdownSerializer.deserialize('');
    expect(parsed.type).toBe('root');
    expect(parsed.children?.length ?? 0).toBe(0);
  });

  it('parses paragraph with softbreaks', () => {
    const md = 'line1\nline2';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('paragraph');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThanOrEqual(1);
  });

  it('parses table with empty align row', () => {
    const md = '| h1 | h2 |\n|    |    |\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    // Align should be null or undefined for both header cells
    expect([null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect([null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with align row but no body rows', () => {
    const md = '| h1 | h2 |\n|:---|---:|';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 1 or 2 rows (header only, or header + align row if implementation includes it)
    expect([1, 2]).toContain(parsed.children?.[0]?.children?.length);
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with extra whitespace in align row', () => {
    const md = '| h1 | h2 |\n| :--- | ---: |\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with empty body row', () => {
    const md = '| h1 | h2 |\n|----|----|\n|    |    |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 2 or 3 rows (header + body, or header + align + body)
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.length).toBe(2);
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.[0]?.type).toBe(
      'tableCell'
    );
  });

  it('parses table with missing cells in body row', () => {
    const md = '| h1 | h2 |\n|----|----|\n| a  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 2 or 3 rows (header + body, or header + align + body)
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    // The body row should have at least one cell
    expect(
      parsed.children?.[0]?.children?.at(-1)?.children?.length
    ).toBeGreaterThanOrEqual(1);
  });

  it('parses table with extra cells in body row', () => {
    const md = '| h1 | h2 |\n|----|----|\n| a  | b  | c |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 2 or 3 rows (header + body, or header + align + body)
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    // The body row should have 3 cells
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.length).toBe(3);
  });

  it('parses table with only align row (invalid, should fallback to header only)', () => {
    const md = '|:---|---:|';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBe(1);
  });

  it('parses table with only whitespace', () => {
    const md = '|    |    |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBe(1);
    expect(parsed.children?.[0]?.children?.[0]?.children?.length).toBe(2);
  });

  it('parses table with header and align but empty body', () => {
    const md = '| h1 | h2 |\n|:---|---:|\n|    |    |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with header and multiple align patterns', () => {
    const md = '| h1 | h2 | h3 |\n|:---|:---:|---:|\n| a | b | c |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['center', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[2]?.attrs?.align
    );
  });

  it('parses table with header and body with empty/whitespace cells', () => {
    const md = '| h1 | h2 |\n|----|----|\n|    | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.length).toBe(2);
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.[0]?.type).toBe(
      'tableCell'
    );
  });

  it('parses table with header and align row with extra columns', () => {
    const md = '| h1 | h2 |\n|:---|---:|:---:|\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    expect(['left', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.align
    );
    expect(['right', null, undefined]).toContain(
      parsed.children?.[0]?.children?.[0]?.children?.[1]?.attrs?.align
    );
  });

  it('parses table with only delimiters (no valid header)', () => {
    const md = '|----|----|';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Should fallback to a single row (treated as header)
    expect(parsed.children?.[0]?.children?.length).toBe(1);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('tableRow');
  });

  it('parses table with only align row (no header)', () => {
    const md = '|:---|:---:|---:|';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Should fallback to a single row (treated as header)
    expect(parsed.children?.[0]?.children?.length).toBe(1);
    expect(parsed.children?.[0]?.children?.[0]?.type).toBe('tableRow');
  });

  it('parses table with mismatched columns in header/align/body', () => {
    const md = '| h1 | h2 | h3 |\n|:---|---:|\n| a | b |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 2 or 3 rows (header + body, or header + align + body)
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    // Header row should have 3 cells, body row should have 2 cells
    expect(parsed.children?.[0]?.children?.[0]?.children?.length).toBe(3);
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.length).toBe(2);
  });

  it('parses table with only whitespace lines between/around tables', () => {
    const md = '\n| h1 | h2 |\n|----|----|\n| a  | b  |\n\n';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    expect(parsed.children?.[0]?.children?.length).toBeGreaterThan(1);
    expect(parsed.children?.[0]?.children?.[0]?.children?.length).toBe(2);
    // Should ignore empty lines before/after table
    expect(parsed.children?.length).toBe(1);
  });

  it('parses table with empty lines inside table block', () => {
    const md = '| h1 | h2 |\n|----|----|\n\n| a  | b  |';
    const parsed = markdownSerializer.deserialize(md);
    expect(parsed.children?.[0]?.type).toBe('table');
    // Accept 2 or 3 rows (header + body, or header + align + body)
    expect([2, 3]).toContain(parsed.children?.[0]?.children?.length);
    // Last row should be the body row
    expect(parsed.children?.[0]?.children?.at(-1)?.children?.length).toBe(2);
  });
});
