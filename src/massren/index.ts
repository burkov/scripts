#!/usr/bin/env node

import commander from 'commander';
import * as process from 'process';

commander.option('-y', '--yes', 'do actual rename');
commander.parse(process.argv);

console.log('hello');
