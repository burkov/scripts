import shelljs from 'shelljs';
import _ from 'lodash';
import { findNpmRoots } from '../common/find-npm-roots';
import { confirmIfMoreThanOnePath } from '../common/paths-renderer';
import Listr from 'listr';
import execa from 'execa';
import path from 'path';
import chalk from 'chalk';

shelljs.config.fatal = true;

const relock = async () => {
  const paths = await findNpmRoots();
  if (await confirmIfMoreThanOnePath('Re-locking following paths:', paths)) {
    const pwd = shelljs.pwd().stdout;
    for (const p of paths) {
      const fullPath = path.normalize(path.join(pwd, p));
      console.log(`Re-locking ${chalk.blue(fullPath)}`);
      const tasks = new Listr([
        {
          title: '  removing node_modules',
          task: () => {
            execa('ls', ['-l'], { cwd: fullPath }).then(({ stdout }) => console.log(stdout));
            // shelljs.rm('-rf', 'node_modules');
            return Promise.resolve();
          },
        },
        {
          title: '  removing package-lock.json',
          task: () => {
            // shelljs.rm('-f', 'package-lock.json');
            return Promise.resolve();
          },
        },
        {
          title: '  running npm install',
          task: () => {
            console.log(fullPath);
            //execa('npm', ['install'])
          },
        },
      ]);
      await tasks.run();
    }
  }
};

export default relock;
