#!/usr/bin/env node

import commander from 'commander';
import relock from './relock';
import template from './template';
import * as process from 'process';
import { version } from './config.json';
import { upFull, upRelock, upTypes } from './up';

commander.name('s').version(version);

commander.command('te').description('projects template collection').action(template);

const upCommand = commander.command('up').description('updates npm project(s)');

upCommand
  .command('types', { isDefault: true })
  .alias('t')
  .description('sync types only. This is the default')
  .action(upTypes);
upCommand
  .command('relock')
  .alias('re')
  .description('remove package-lock.json and re-install deps')
  .action(upRelock);
upCommand
  .command('full')
  .alias('f')
  .description('does the all above also updates package.json')
  .action(upFull);

commander.parse(process.argv);
