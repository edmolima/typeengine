const references: Record<string, { href: string; title?: string }> = {};
import type { DocumentNode } from '../document';

// --- Helpers ---
function escapeMarkdown(text: string): string {
  return text.replace(/[\\*_`\[\]#\-]/g, '\\$&');
}

function serializeNode(node: DocumentNode): string {
  switch (node.type) {
    case 'root':
      return (node.children ?? []).map(serializeNode).join('\n\n');
    case 'heading': {
      const level =
        node.attrs && typeof node.attrs['level'] === 'number'
          ? Math.max(1, Math.min(6, node.attrs['level'] as number))
          : 1;
      return `${'#'.repeat(level)} ${(node.children ?? [])
        .map(serializeNode)
        .join('')}`;
    }
    case 'paragraph':
      return (node.children ?? []).map(serializeNode).join('');
    case 'list': {
      const ordered = node.attrs && node.attrs['ordered'] === true;
      return (node.children ?? [])
        .map((child, i) => {
          const bullet = ordered ? `${i + 1}.` : '-';
          return `${bullet} ${serializeNode(child)}`;
        })
        .join('\n');
    }
    case 'listItem':
      return (node.children ?? []).map(serializeNode).join('');
    case 'blockquote':
      return (node.children ?? [])
        .map(serializeNode)
        .join('\n')
        .split('\n')
        .map((l) => (l ? `> ${l}` : '>'))
        .join('\n');
    case 'thematicBreak':
      return '---';
    case 'code': {
      const lang =
        node.attrs && node.attrs['lang'] ? String(node.attrs['lang']) : '';
      return `\n\`\`\`${lang}\n${node.text ?? ''}\n\`\`\``;
    }
    case 'html':
      return (node as any).text ?? '';
    case 'table': {
      const rows = node.children ?? [];
      if (!rows.length) return '';
      const header = rows[0];
      const body = rows.slice(1);
      if (!header || !header.children) return '';
      const headerCells = header.children.map(serializeNode).join(' | ');
      const alignRow = header.children
        .map((cell) => {
          const align = cell.attrs && (cell.attrs as any)['align'];
          if (align === 'left') return ':---';
          if (align === 'right') return '---:';
          if (align === 'center') return ':---:';
          return '---';
        })
        .join(' | ');
      const bodyRows = body
        .map((row) => (row.children ?? []).map(serializeNode).join(' | '))
        .join('\n');
      return `| ${headerCells} |\n| ${alignRow} |${
        bodyRows ? '\n' + bodyRows : ''
      }`;
    }
    case 'tableRow':
      return (node.children ?? []).map(serializeNode).join(' | ');
    case 'tableCell':
      return (node.children ?? []).map(serializeNode).join('');
    case 'text':
      return node.text ? escapeMarkdown(node.text) : '';
    case 'emphasis':
      return `*${(node.children ?? []).map(serializeNode).join('')}*`;
    case 'strong':
      return `**${(node.children ?? []).map(serializeNode).join('')}**`;
    case 'inlineCode':
      return '`' + (node.text ?? '') + '`';
    case 'link':
      return `[${(node.children ?? []).map(serializeNode).join('')}](${
        node.attrs && (node.attrs as any)['href']
          ? (node.attrs as any)['href']
          : ''
      })`;
    case 'image':
      return `![${
        node.attrs && (node.attrs as any)['alt']
          ? (node.attrs as any)['alt']
          : ''
      }](${
        node.attrs && (node.attrs as any)['src']
          ? (node.attrs as any)['src']
          : ''
      })`;
    default:
      return '';
  }
}

// --- Markdown Parser ---
type MarkdownParseContext = {
  lines: string[];
  i: number;
  nextId: (type: string) => string;
  references: Record<string, { href: string; title?: string }>;
};

function parseMarkdown(md: string): DocumentNode {
  const lines = md.split(/\r?\n/);
  // Removed unused variable 'i'
  let idCounter = 1;
  function nextId(type: string) {
    return `${type}_${idCounter++}`;
  }
  // Parse reference definitions
  for (let j = 0; j < lines.length; j++) {
    const refMatch =
      typeof lines[j] === 'string' && lines[j] !== undefined && lines[j]
        ? typeof lines[j] === 'string' && lines[j] !== undefined
          ? lines[j]!.match(/^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?/)
          : null
        : null;
    if (refMatch && refMatch[1] && refMatch[2]) {
      references[refMatch[1].toLowerCase()] = {
        href: refMatch[2],
        ...(refMatch[3] ? { title: refMatch[3] } : {}),
      };
      lines[j] = '';
    }
  }
  const ctx: MarkdownParseContext = { lines, i: 0, nextId, references };
  const children = parseBlocks(ctx);
  return { id: nextId('root'), type: 'root', children };
}

function parseBlocks(
  ctx: MarkdownParseContext,
  stopOn?: (line: string) => boolean
): DocumentNode[] {
  const { lines, nextId } = ctx;
  let { i } = ctx;
  const nodes: DocumentNode[] = [];
  while (i < lines.length) {
    let line = lines[i];
    if (stopOn && typeof line === 'string' && stopOn(line)) break;
    if (!line || /^\s*$/.test(line ?? '')) {
      i++;
      continue;
    }
    // Thematic break
    if (/^\s*---+\s*$/.test(line)) {
      nodes.push({
        id: nextId('thematicBreak'),
        type: 'thematicBreak',
        children: [],
      });
      i++;
      continue;
    }
    // HTML block
    if (/^<([a-zA-Z][\w-]*)(\s|>|$)/.test(line ?? '')) {
      let html = line ?? '';
      i++;
      while (
        i < lines.length &&
        typeof lines[i] === 'string' &&
        !/^<\/[a-zA-Z][\w-]*>/.test(lines[i] ?? '')
      ) {
        html += '\n' + (lines[i] ?? '');
        i++;
      }
      if (i < lines.length && typeof lines[i] === 'string') {
        html += '\n' + (lines[i] ?? '');
        i++;
      }
      nodes.push({
        id: nextId('html'),
        type: 'html' as any,
        text: html,
        children: [],
      });
      continue;
    }
    // Heading
    const headingMatch = (line ?? '').match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch && headingMatch[1] && headingMatch[2]) {
      nodes.push({
        id: nextId('heading'),
        type: 'heading',
        attrs: { level: headingMatch[1].length },
        children: parseInlines(headingMatch[2], ctx),
      });
      i++;
      continue;
    }
    // Code block
    if (/^```/.test(line ?? '')) {
      const lang = (line ?? '').replace(/^```/, '').trim();
      let code = '';
      i++;
      while (
        i < lines.length &&
        typeof lines[i] === 'string' &&
        !/^```/.test(lines[i] ?? '')
      ) {
        code += (code ? '\n' : '') + (lines[i] ?? '');
        i++;
      }
      i++;
      nodes.push({
        id: nextId('code'),
        type: 'code',
        attrs: lang ? { lang } : {},
        text: code,
        children: [],
      });
      continue;
    }
    // Blockquote
    if (/^>\s?/.test(line ?? '')) {
      let quoteLines: string[] = [];
      while (
        i < lines.length &&
        typeof lines[i] === 'string' &&
        /^>\s?/.test(lines[i] ?? '')
      ) {
        quoteLines.push((lines[i] ?? '').replace(/^>\s?/, ''));
        i++;
      }
      while (
        quoteLines.length &&
        typeof quoteLines[0] === 'string' &&
        /^\s*$/.test(quoteLines[0] ?? '')
      )
        quoteLines.shift();
      while (
        quoteLines.length &&
        typeof quoteLines[quoteLines.length - 1] === 'string' &&
        /^\s*$/.test(quoteLines[quoteLines.length - 1] ?? '')
      )
        quoteLines.pop();
      const children = parseBlocks(
        { ...ctx, lines: quoteLines, i: 0 },
        undefined
      );
      nodes.push({ id: nextId('blockquote'), type: 'blockquote', children });
      continue;
    }
    // List
    if (/^([\-*]|\d+\.)\s+/.test(line ?? '')) {
      const ordered = /\d+\./.test(line ?? '');
      const items: DocumentNode[] = [];
      while (
        i < lines.length &&
        typeof lines[i] === 'string' &&
        /^([\-*]|\d+\.)\s+/.test(lines[i] ?? '')
      ) {
        let liLine = (lines[i] ?? '').replace(/^([\-*]|\d+\.)\s+/, '');
        i++;
        // Nested blocks inside list item
        const subItems = parseBlocks(
          { ...ctx, lines, i },
          (l) => /^([\-*]|\d+\.)\s+/.test(l ?? '') || /^\s*$/.test(l ?? '')
        );
        items.push({
          id: nextId('li'),
          type: 'listItem',
          children: [...parseInlines(liLine, ctx), ...subItems],
        });
      }
      nodes.push({
        id: nextId('list'),
        type: 'list',
        attrs: { ordered },
        children: items,
      });
      continue;
    }
    // Table
    if (/^\|(.+)\|$/.test(line ?? '')) {
      const tableLines = [line ?? ''];
      i++;
      while (
        i < lines.length &&
        typeof lines[i] === 'string' &&
        /^\|(.+)\|$/.test(lines[i] ?? '')
      ) {
        tableLines.push(lines[i] ?? '');
        i++;
      }
      // Determine if align row is present (second line, must match /^\|([\s:-]+)\|$/)
      let header, align, rows;
      if (
        tableLines.length > 1 &&
        /^\|([\s:-]+)\|$/.test(tableLines[1] ?? '')
      ) {
        [header, align, ...rows] = tableLines;
      } else {
        [header, ...rows] = tableLines;
        align = undefined;
      }
      const headerCells = (header ?? '')
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());
      // Parse align row if present, otherwise undefined
      const alignCells =
        align && /^\|([\s:-]+)\|$/.test(align ?? '')
          ? (align ?? '')
              .split('|')
              .slice(1, -1)
              .map((cell) => {
                const trimmed = cell.trim();
                if (trimmed.startsWith(':') && trimmed.endsWith(':'))
                  return 'center';
                if (trimmed.startsWith(':')) return 'left';
                if (trimmed.endsWith(':')) return 'right';
                return undefined;
              })
          : [];
      // Header row: always set align (even if undefined)
      const headerRow: DocumentNode = {
        id: nextId('tableRow'),
        type: 'tableRow',
        children: headerCells.map((cell, idx) => {
          const attrs: any = { header: true };
          if (typeof align !== 'undefined') {
            attrs.align =
              typeof alignCells[idx] !== 'undefined' ? alignCells[idx] : null;
          }
          return {
            id: nextId('tableCell'),
            type: 'tableCell',
            attrs,
            children: parseInlines(cell, ctx),
          };
        }),
      };
      // Body rows: only include if there are any (not just align row)
      let rowNodes: DocumentNode[] = [];
      if (Array.isArray(rows) && rows.length > 0) {
        // Only treat as body row if it is not the align row (compare trimmed) and not empty
        rowNodes = rows
          .filter((row) => {
            if (!row || row.trim() === '') return false;
            if (typeof align !== 'undefined' && row.trim() === align.trim())
              return false;
            return true;
          })
          .map((row) => {
            const rowStr = row ?? '';
            const cells = rowStr
              .split('|')
              .slice(1, -1)
              .map((cell) => cell.trim());
            return {
              id: nextId('tableRow'),
              type: 'tableRow',
              children: cells.map((cell, idx) => {
                const attrs: any = {};
                if (
                  typeof align !== 'undefined' &&
                  typeof alignCells[idx] !== 'undefined'
                ) {
                  attrs.align = alignCells[idx];
                }
                return {
                  id: nextId('tableCell'),
                  type: 'tableCell',
                  attrs,
                  children: parseInlines(cell, ctx),
                };
              }),
            } as DocumentNode;
          });
      }
      // If there are no body rows, only header row should be present
      nodes.push({
        id: nextId('table'),
        type: 'table',
        children: rowNodes.length > 0 ? [headerRow, ...rowNodes] : [headerRow],
      } as DocumentNode);
      continue;
    }
    // Paragraph (default)
    let para = line ?? '';
    i++;
    while (
      i < lines.length &&
      typeof lines[i] === 'string' &&
      !/^(#{1,6}|```|[\-*]|\d+\.|>|---+|\||<)/.test(lines[i] ?? '')
    ) {
      para += /\S/.test(lines[i] ?? '') ? ' ' + (lines[i] ?? '') : '\n';
      i++;
    }
    const inlineNodes = parseInlines(para, ctx);
    if (inlineNodes.length > 0) {
      nodes.push({
        id: nextId('paragraph'),
        type: 'paragraph',
        children: inlineNodes,
      });
    }
  }
  ctx.i = i;
  return nodes;
}

// --- Inline parser (minimal, extensível) ---
function parseInlines(text: string, ctx: MarkdownParseContext): DocumentNode[] {
  if (!text) return [];
  // Inline code
  if (/^`[^`]+`$/.test(text)) {
    return [
      {
        id: ctx.nextId('inlineCode'),
        type: 'inlineCode',
        text: text.slice(1, -1),
        children: [],
      },
    ];
  }
  // Strong
  if (/^\*\*[^*]+\*\*$/.test(text)) {
    return [
      {
        id: ctx.nextId('strong'),
        type: 'strong',
        children: parseInlines(text.slice(2, -2) || '', ctx),
      },
    ];
  }
  // Emphasis
  if (/^\*[^*]+\*$/.test(text)) {
    return [
      {
        id: ctx.nextId('emphasis'),
        type: 'emphasis',
        children: parseInlines(text.slice(1, -1) || '', ctx),
      },
    ];
  }
  // Link
  const linkMatch = text.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
  if (linkMatch && linkMatch[1] && linkMatch[2]) {
    return [
      {
        id: ctx.nextId('link'),
        type: 'link',
        attrs: { href: linkMatch[2] },
        children: parseInlines(linkMatch[1] || '', ctx),
      },
    ];
  }
  // Image
  const imgMatch = text.match(/^!\[([^\]]*)\]\(([^\)]+)\)$/);
  if (imgMatch && imgMatch[1] && imgMatch[2]) {
    return [
      {
        id: ctx.nextId('image'),
        type: 'image',
        attrs: { alt: imgMatch[1], src: imgMatch[2] },
        children: [],
      },
    ];
  }
  // Fallback: text
  return [{ id: ctx.nextId('text'), type: 'text', text, children: [] }];
}

// --- Exported API ---
export const markdownSerializer = {
  serialize(doc: DocumentNode): string {
    return serializeNode(doc).trim();
  },
  deserialize(md: string): DocumentNode {
    return parseMarkdown(md);
  },
};
