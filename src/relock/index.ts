import shelljs from 'shelljs';
import _ from 'lodash';
import { findNpmRoots } from '../common/find-npm-roots';
import { confirmIfMoreThanOnePath } from '../common/paths-renderer';
import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import chalk from 'chalk';
import * as process from 'process';
import { pathColorFn } from '../common/colors';

shelljs.config.fatal = true;

const relock = async () => {
  const paths = await findNpmRoots();
  if (paths.length === 0) {
    console.log(`No npm projects were found in current work dir ${pathColorFn(process.cwd())}`);
    return;
  }
  if (await confirmIfMoreThanOnePath(`Re-locking following paths (${paths.length}):`, paths)) {
    const pwd = shelljs.pwd().stdout;
    for (const p of paths) {
      const fullPath = path.normalize(path.join(pwd, p));
      console.log(`Re-locking ${pathColorFn(fullPath)}`);
      const tasks = new Listr([
        {
          title: 'removing node_modules',
          task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd: fullPath }),
        },
        {
          title: 'removing package-lock.json',
          task: () => execa('rm', ['-f', 'package-lock.json'], { cwd: fullPath }),
        },
        {
          title: 'running npm install',
          task: () => execa('npm', ['install'], { cwd: fullPath }),
        },
      ]);
      await tasks.run();
    }
  }
};

export default relock;
