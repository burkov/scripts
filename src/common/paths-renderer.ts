import path from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import inquirer from 'inquirer';

class FilesTreeNode {
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

class FilesTree {
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

const treeFromPaths = (paths: string[]): FilesTree => {
  const result = new FilesTree();
  paths.forEach(result.addPath.bind(result));
  return result;
};

const levelIndents = (node: FilesTreeNode): number[] => {
  const result: number[] = [];
  const recur = (node: FilesTreeNode, i: number) => {
    if ((result[i] || 0) < node.name.length) result[i] = node.name.length;
    node.children.forEach((e) => recur(e, i + 1));
  };
  recur(node, 0);
  result.shift();
  return result;
};

const colors = _.shuffle([
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
  chalk.white,
]);

export const confirmIfMoreThanOnePath = async (
  message: string,
  paths: string[],
): Promise<boolean> => {
  if (paths.length === 1) return true;
  console.log(message);
  printPaths(paths);
  const { goAhead } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'goAhead',
      message: 'Continue?',
      default: true,
    },
  ]);
  return goAhead as boolean;
};

export const printPaths = (paths: string[]) => {
  console.log(
    renderPaths(paths)
      .sort((a, b) => {
        if (a.length < b.length) return -1;
        if (a.length > b.length) return 1;
        return a.localeCompare(b);
      })
      .map((e, i) => `${(i + 1).toString().padStart(4)}) ${e}`)
      .join('\n'),
  );
};

export const renderPaths = (paths: string[]): string[] => {
  const tree = treeFromPaths(paths);
  const indents = levelIndents(tree.root);
  const renderRecursively = (node: FilesTreeNode, indentLevel: number): string[] => {
    const padTo = indents[indentLevel] || 0;
    const children = node.children.flatMap((e) => renderRecursively(e, indentLevel + 1));
    const colorFn = colors[indentLevel] || chalk.white;
    return [colorFn(node.name.padEnd(padTo, ' ')), ...children];
  };

  return tree.root.children.map((e) => {
    return renderRecursively(e, 0).join(' / ');
  });
};
