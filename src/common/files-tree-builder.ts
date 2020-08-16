import path from 'path';

export class FilesTreeNode {
  readonly name: string;
  readonly children: FilesTreeNode[] = [];
  constructor(name: string) {
    this.name = name;
  }
  addChildNode(name: string): FilesTreeNode {
    const found = this.children.find((e) => e.name === name);
    if (found) return found;
    const newNode = new FilesTreeNode(name);
    this.children.push(newNode);
    return newNode;
  }
}

export class FilesTree {
  readonly root: FilesTreeNode;
  constructor() {
    this.root = new FilesTreeNode('.');
  }
  addPath(name: string) {
    let current = this.root;
    path
      .normalize(name)
      .split(path.sep)
      .forEach((e) => {
        current = current.addChildNode(e);
      });
  }
}

export const treeFromPaths = (paths: string[]): FilesTree => {
  const result = new FilesTree();
  paths.forEach(result.addPath.bind(result));
  return result;
};

export const levelIndents = (node: FilesTreeNode): number[] => {
  const result: number[] = [];
  const recur = (node: FilesTreeNode, i: number) => {
    if ((result[i] || 0) < node.name.length) result[i] = node.name.length;
    node.children.forEach((e) => recur(e, i + 1));
  };
  recur(node, 0);
  result.shift();
  return result;
};
