import execa from 'execa';
import path from 'path';
import { forEachConfirmedPath } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';

const runTypesync = (cwd: string) => ({
  title: 'syncing types',
  task: () => execa('npx', ['typesync'], { cwd }),
});

const removeNodeModuleDir = (cwd: string) => ({
  title: 'removing node_modules',
  task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd }),
});

const removePackageLock = (cwd: string) => ({
  title: 'removing package-lock.json',
  task: () => execa('rm', ['-f', 'package-lock.json'], { cwd }),
});

const runNpmInstall = (cwd: string) => ({
  title: 'running npm install',
  task: () => execa('npm', ['install'], { cwd }),
});

const runCheckUpdates = (cwd: string) => ({
  title: 'update package versions',
  task: () => execa('npx', ['npm-check-updates', '-u'], { cwd }),
});

export const upTypes = () => {
  return forEachConfirmedPath(
    'Sync types?',
    (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
    (cwd) => [runTypesync(cwd), runNpmInstall(cwd)],
  );
};

export const upRelock = () => {
  return forEachConfirmedPath(
    'Re-lock?',
    (cwd: string) => `Re-locking ${pathColorFn(path.resolve(cwd))}`,
    (cwd) => [removeNodeModuleDir(cwd), removePackageLock(cwd), runNpmInstall(cwd)],
  );
};

export const upFull = () => {
  return forEachConfirmedPath(
    'Full update?',
    (cwd) => `Doing full project update ${pathColorFn(cwd)}`,
    (cwd) => {
      return [
        runCheckUpdates(cwd),
        runTypesync(cwd),
        removeNodeModuleDir(cwd),
        removePackageLock(cwd),
        runNpmInstall(cwd),
      ];
    },
  );
};
