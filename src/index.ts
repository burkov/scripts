import commander from 'commander';
import relock from './relock';
import template from './template';
import up from './up';
import * as process from 'process';
import { version } from './config.json';

commander.name('s').version(version);

commander
  .command('relock')
  .alias('re')
  .description('recursively finds all package.json files and does a fresh install')
  .action(relock);

commander
  .command('template')
  .alias('t')
  .description('projects template collection')
  .action(template);

commander.command('up').description('sync types and updates packages').action(up);

commander.parse(process.argv);
