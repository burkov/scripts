#!/usr/bin/env node

import commander from 'commander';
import * as process from 'process';
import { forEachConfirmedPath } from '../common/find-npm-projects';
import { pathColorFn } from '../common/colors';
import path from 'path';
import { removeNodeModuleDir, removePackageLock, runNpmInstall } from '../common/commands';

commander.parse(process.argv);

forEachConfirmedPath(
  'Re-lock?',
  (cwd: string) => `Re-locking ${pathColorFn(path.resolve(cwd))}`,
  (cwd: string) => [removeNodeModuleDir(cwd), removePackageLock(cwd), runNpmInstall(cwd)],
).then();
