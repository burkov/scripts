import path from 'path';
import { forEachConfirmedPath } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';
import {
  removeNodeModuleDir,
  removePackageLock,
  runCheckUpdates,
  runNpmInstall,
  runTypesync,
} from '../common/commands';

export const upTypes = () =>
  forEachConfirmedPath(
    'Sync types?',
    (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
    (cwd: string) => [runTypesync(cwd), runNpmInstall(cwd)],
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
    (cwd: string) => `Doing full project update ${pathColorFn(cwd)}`,
    (cwd: string) => [
      runCheckUpdates(cwd),
      runTypesync(cwd),
      removeNodeModuleDir(cwd),
      removePackageLock(cwd),
      runNpmInstall(cwd),
    ],
  );
