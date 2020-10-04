import path from 'path';
import { forEachConfirmedPath } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';
import {
  removeNodeModuleDir,
  removePackageLock,
  runNpmInstall,
  syncTypes,
  updatePackagesVersions,
} from '../common/commands';

export const upTypes = () =>
  forEachConfirmedPath(
    'Sync types?',
    (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
    (cwd: string) => [syncTypes(cwd), runNpmInstall(cwd)],
  );


export const upFull = () =>
  forEachConfirmedPath(
    'Full update?',
    (cwd: string) => `Doing full project update ${pathColorFn(cwd)}`,
    (cwd: string) => [
      updatePackagesVersions(cwd),
      syncTypes(cwd),
      removeNodeModuleDir(cwd),
      removePackageLock(cwd),
      runNpmInstall(cwd),
    ],
  );
