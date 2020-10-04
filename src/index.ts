#!/usr/bin/env node

import commander from 'commander';
import template from './template';
import * as process from 'process';
import { upFull, upTypes } from './up';

commander.command('te').description('projects template collection').action(template);

const upCommand = commander.command('up').description('updates npm project(s)');

upCommand
  .command('types', { isDefault: true })
  .alias('t')
  .description('sync types only. This is the default')
  .action(upTypes);
upCommand
  .command('full')
  .alias('f')
  .description('does the all above also updates package.json')
  .action(upFull);

commander.parse(process.argv);
