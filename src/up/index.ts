import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import { findProjectsAndAskConfirmation } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';

export const syncTypesInOneDir = (cwd: string, skipInstall: boolean = false): Listr.ListrTask[] => [
  {
    title: 'Syncing types',
    task: () => execa('npx', ['typesync'], { cwd }),
  },
  {
    title: 'Installing packages with typings',
    skip: () => skipInstall,
    task: () => execa('npm', ['install'], { cwd }),
  },
];

export const upTypes = async () => {
  await findProjectsAndAskConfirmation('Sync types?', (paths) =>
    new Listr(
      paths.map((cwd: string) => ({
        title: `Updating types in ${pathColorFn(path.resolve(cwd))}`,
        task: () => new Listr(syncTypesInOneDir(cwd)),
      })),
      { concurrent: 2 },
    )
      .run()
      .catch(console.error),
  );
};

const relockOneDir = (cwd: string) => [
  {
    title: 'removing node_modules',
    task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd }),
  },
  {
    title: 'removing package-lock.json',
    task: () => execa('rm', ['-f', 'package-lock.json'], { cwd }),
  },
  {
    title: 'running npm install',
    task: () => execa('npm', ['install'], { cwd }),
  },
];

export const upRelock = async () => {
  await findProjectsAndAskConfirmation('Re-lock?', (paths) =>
    new Listr(
      paths.map((cwd) => ({
        title: `Re-locking ${pathColorFn(path.resolve(cwd))}`,
        task: () => new Listr(relockOneDir(cwd)),
      })),
      { concurrent: 2 },
    )
      .run()
      .catch(console.error),
  );
};

export const upFull = async () => {
  await findProjectsAndAskConfirmation('Full update?', (paths: string[]) =>
    new Listr(
      paths.map((cwd) => ({
        title: 'Doing full project update',
        task: () =>
          new Listr([
            {
              title: 'Update package versions',
              task: () => execa('npx', ['npm-check-updates', '-u'], { cwd }),
            },
            ...syncTypesInOneDir(cwd, true),
            ...relockOneDir(cwd),
          ]),
      })),
      { concurrent: 2 },
    )
      .run()
      .catch(console.error),
  );
};
