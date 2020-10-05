#!/usr/bin/env node

import {forEachConfirmedPath} from "../common/find-npm-projects";
import {pathColorFn} from "../common/colors";
import {
  removeNodeModuleDir,
  removePackageLock,
  runNpmInstall,
  syncTypes,
  updatePackagesVersions
} from "../common/commands";

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
).then();
