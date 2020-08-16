import execa from 'execa';
import * as process from 'process';
import * as fs from 'fs';

export const runTypesync = (cwd: string) => ({
  title: 'syncing types',
  task: () => execa('npx', ['typesync'], { cwd }),
});

export const removeNodeModuleDir = (cwd: string) => ({
  title: 'removing node_modules',
  task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd }),
});

export const removePackageLock = (cwd: string) => ({
  title: 'removing package-lock.json',
  task: () => execa('rm', ['-f', 'package-lock.json'], { cwd }),
});

export const runNpmInstall = (cwd: string) => ({
  title: 'running npm install',
  task: () => execa('npm', ['install'], { cwd }),
});

export const runCheckUpdates = (cwd: string) => ({
  title: 'update package versions',
  task: () => execa('npx', ['npm-check-updates', '-u', '--packageFile', 'package.json'], { cwd }),
});
