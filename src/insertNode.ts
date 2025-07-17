import { DocumentNode } from './document';

/**
 * Insere um novo nó como filho de um nó pai especificado, na posição desejada.
 * Retorna uma nova árvore de documento, sem mutar a original (imutável).
 *
 * @param tree - Árvore de documento original (não será modificada)
 * @param parentId - ID do nó pai onde o novo nó será inserido
 * @param newNode - O nó a ser inserido
 * @param index - Posição (base 0) entre os filhos do pai onde inserir
 * @returns Uma nova árvore de documento com o nó inserido
 * @throws Se parentId não for encontrado ou se index for inválido
 */

export function insertNode(
  tree: DocumentNode,
  parentId: string,
  newNode: DocumentNode,
  index: number
): DocumentNode {
  if (tree.id === parentId) {
    const children = tree.children ? [...tree.children] : [];
    if (index < 0 || index > children.length) {
      throw new Error('Index out of bounds');
    }
    return {
      ...tree,
      children: [
        ...children.slice(0, index),
        newNode,
        ...children.slice(index),
      ],
    };
  }
  if (!tree.children) {
    throw new Error('Parent node not found');
  }
  let found = false;
  const newChildren = tree.children.map((child) => {
    try {
      const result = insertNode(child, parentId, newNode, index);
      found = true;
      return result;
    } catch {
      return child;
    }
  });
  if (!found) {
    throw new Error('Parent node not found');
  }
  return { ...tree, children: newChildren };
}
