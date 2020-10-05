#!/usr/bin/env node

import {forEachConfirmedPath} from "../common/find-npm-projects";
import {pathColorFn} from "../common/colors";
import path from "path";
import {runNpmInstall, syncTypes} from "../common/commands";

forEachConfirmedPath(
  'Sync types?',
  (cwd: string) => `Updating types in ${pathColorFn(path.resolve(cwd))}`,
  (cwd: string) => [syncTypes(cwd), runNpmInstall(cwd)],
).then();
