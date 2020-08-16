import execa from 'execa';
import path from 'path';
import { forEachConfirmedPath } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';

export const runTypesync = (cwd: string) => ({
  title: 'syncing types',
  task: () => execa('npx', ['typesync'], { cwd }),
});

export const removeNodeModuleDir = (cwd: string) => ({
  title: 'removing node_modules',
  task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd }),
});

export const removePackageLock = (cwd: string) => ({
  title: 'removing package-lock.json',
  task: () => execa('rm', ['-f', 'package-lock.json'], { cwd }),
});

export const runNpmInstall = (cwd: string) => ({
  title: 'running npm install',
  task: () => execa('npm', ['install'], { cwd }),
});

export const runCheckUpdates = (cwd: string) => ({
  title: 'update package versions',
  task: () => execa('npx', ['npm-check-updates', '-u'], { cwd }),
});

export const upTypes = () =>
  forEachConfirmedPath(
    'Sync types?',
    (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
    (cwd) => [runTypesync(cwd), runNpmInstall(cwd)],
  );

export const upRelock = () =>
  forEachConfirmedPath(
    'Re-lock?',
    (cwd: string) => `Re-locking ${pathColorFn(path.resolve(cwd))}`,
    (cwd) => [removeNodeModuleDir(cwd), removePackageLock(cwd), runNpmInstall(cwd)],
  );

export const upFull = () =>
  forEachConfirmedPath(
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
