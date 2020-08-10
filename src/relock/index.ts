import shelljs from 'shelljs';
import _ from 'lodash';
import { findNpmRoots } from '../common';
import { confirmIfMoreThanOnePath } from '../common/paths-renderer';

shelljs.config.fatal = true;

const relock = async () => {
  const paths = await findNpmRoots();
  if (await confirmIfMoreThanOnePath('Re-locking following paths:', paths)) {
    const pwd = shelljs.pwd().stdout;
    _.forEach(paths, (path: string) => {
      console.log(`Re-locking ${path}`);
      shelljs.cd(pwd);
      shelljs.cd(path);
      console.log('  removing node_modules');
      shelljs.rm('-rf', 'node_modules');
      console.log('  removing package-lock.json');
      shelljs.rm('-f', 'package-lock.json');
      console.log('  running npm install');
      shelljs.exec(`npm i`, { silent: true, fatal: true });
    });
  }
};

export default relock;
