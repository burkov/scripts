#!/usr/bin/env node

import commander from 'commander';
import * as process from 'process';
import { fdir as FDir } from 'fdir';
import _ from 'lodash';
import * as fs from 'fs';

const program = new commander.Command();

program.option('-y, --yes', 'do actual rename');
program.parse(process.argv);

const crawlDir = '.';

const result = new FDir()
  .withDirs()
  .withMaxDepth(2)
  .filter(_.stubFalse)
  .crawl(crawlDir)
  .sync() as string[];

const toMove = result
  .filter((e) => /\d{4}\.\d{2}\.\d{2}/.test(e))
  .map((from) => ({ from, to: from.replace(/\d{4}\./, '') }));

toMove.forEach(({ from, to }) => {
  console.log(`${from.replace(crawlDir, '')} -> ${to.replace(crawlDir, '')}`);
  if (program.yes) fs.renameSync(from, to);
});
