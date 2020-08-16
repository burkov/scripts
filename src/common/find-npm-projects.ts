import path from 'path';
// @ts-ignore
import findit from 'findit';
import { pathColorFn } from './colors';
import process from 'process';
import inquirer from 'inquirer';
import { renderPaths } from './paths-renderer';
import Listr from 'listr';

const excludeFromSearch = ['.git', '.idea', 'node_modules', 'kotlin', 'build'];

const findNpmProjects = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const result: string[] = [];
    const finder = findit('.');
    finder.on('directory', function (dir: string, stat: any, stop: () => void) {
      const base = path.basename(dir);
      if (excludeFromSearch.includes(base)) stop();
    });

    finder.on('file', function (file: string, stat: any) {
      if (file.includes('package.json')) result.push(path.dirname(file));
    });

    finder.on('end', function () {
      resolve(result.map((e) => e.trim()).filter((e) => e.length > 0));
    });
  });
};

const confirmIfMoreThanOnePath = async (message: string, paths: string[]): Promise<boolean> => {
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

export const forEachConfirmedPath = (
  confirmMessage: string,
  titleFn: (path: string) => string,
  processPath: (path: string) => Listr.ListrTask[],
) => {
  return findProjectsAndAskConfirmation(confirmMessage, (paths) => {
    new Listr(
      paths.map((cwd) => ({
        title: titleFn(cwd),
        task: () => new Listr(processPath(cwd)),
      })),
      { concurrent: 2 },
    )
      .run()
      .catch(console.error);
  });
};

export const findProjectsAndAskConfirmation = async (
  confirmMessage: string,
  onConfirm: (paths: string[]) => void,
) => {
  const paths = await findNpmProjects();
  if (paths.length === 0) {
    console.log(`No npm projects were found in current work dir ${pathColorFn(process.cwd())}`);
    return;
  }
  if (await confirmIfMoreThanOnePath(confirmMessage, paths)) onConfirm(paths);
};
