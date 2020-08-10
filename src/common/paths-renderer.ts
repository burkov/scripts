import chalk from 'chalk';
import _ from 'lodash';
import inquirer from 'inquirer';
import { FilesTreeNode, levelIndents, treeFromPaths } from './files-tree-builder';

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
  console.log(
    renderPaths(paths)
      .map((e, i) => `${(i + 1).toString().padStart(4)}) ${e}`)
      .join('\n'),
  );
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

export interface RenderOptions {
  noColors?: boolean;
}

type ColorFn = (s: string) => string;

export const renderPaths = (paths: string[], renderOptions?: RenderOptions): string[] => {
  const tree = treeFromPaths(paths);
  const indents = levelIndents(tree.root);
  const renderRecursively = (node: FilesTreeNode, indentLevel: number): string[] => {
    const padTo = indents[indentLevel] || 0;
    const children = node.children.flatMap((e) => renderRecursively(e, indentLevel + 1));
    const colorFn: ColorFn = renderOptions?.noColors
      ? _.identity
      : colors[indentLevel] || chalk.white;
    return [colorFn(node.name.padEnd(padTo, ' ')), ...children];
  };

  return tree.root.children
    .map((e) => renderRecursively(e, 0).join(' / '))
    .sort((a, b) => {
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return a.localeCompare(b);
    });
};
