import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import { forEachConfirmedPath } from '../common/find-npm-projects';
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

export const upTypes = () => {
  return forEachConfirmedPath(
    'Sync types?',
    (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
    syncTypesInOneDir,
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

export const upRelock = () => {
  return forEachConfirmedPath(
    'Re-lock?',
    (cwd: string) => `Re-locking ${pathColorFn(path.resolve(cwd))}`,
    relockOneDir,
  );
};

export const upFull = () => {
  return forEachConfirmedPath(
    'Full update?',
    (cwd) => `Doing full project update ${pathColorFn(cwd)}`,
    (cwd) => {
      return [
        {
          title: 'Update package versions',
          task: () => execa('npx', ['npm-check-updates', '-u'], { cwd }),
        },
        ...syncTypesInOneDir(cwd, true),
        ...relockOneDir(cwd),
      ];
    },
  );
};
