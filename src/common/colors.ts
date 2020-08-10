import _ from 'lodash';
import chalk from 'chalk';

export type ColorFn = (s: string) => string;

export const noColorFn: ColorFn = _.identity;

export const pathColorFn: ColorFn = chalk.blue

export const randomColorFn = (i: number) => randomColorFns[i] || noColorFn;

const randomColorFns: ColorFn[] = _.shuffle([
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue,
  chalk.magenta,
  chalk.cyan,
  chalk.white,
]);
