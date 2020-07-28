#!/usr/bin/env node
import shelljs from 'shelljs';
// @ts-ignore
import findit from 'findit';
import path from 'path';
import _ from 'lodash';

shelljs.config.fatal = true;

const findNpmRoots = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const result: string[] = [];
    const finder = findit('.');
    finder.on('directory', function (dir: string, stat: any, stop: () => void) {
      const base = path.basename(dir);
      const exclude = ['.git', '.idea', 'node_modules', 'kotlin', 'build'];
      if (exclude.includes(base)) stop();
    });

    finder.on('file', function (file: string, stat: any) {
      if (file.includes('package.json')) result.push(path.dirname(file));
    });

    finder.on('end', function () {
      resolve(result);
    });
  });
};

findNpmRoots().then((dirs) => {
  _.forEach(dirs, (dir) => {
    console.log(`Re-locking ${dir}`);
    shelljs.cd(dir);
    console.log('  removing node_modules');
    shelljs.rm('-rf', 'node_modules');
    console.log('  removing package-lock.json');
    shelljs.rm('package-lock.json');
    console.log('  running npm install');
    shelljs.exec(`npm i`, { silent: true, fatal: true });
  });
});
