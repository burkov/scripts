import commander from 'commander';
import relock from './relock';
import template from './template';
import up from './up';
import * as process from 'process';

commander.name('s').version('wtf');

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
