import execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';

export const syncTypes = (cwd: string) => ({
  title: 'Syncing types',
  task: () => execa('npx', ['typesync'], { cwd }),
});

export const removeNodeModuleDir = (cwd: string) => ({
  title: 'Removing node_modules',
  task: () => execa('rm', ['-r', '-f', 'node_modules'], { cwd }),
});

export const removePackageLock = (cwd: string) => ({
  title: 'Removing package-lock.json',
  task: () => execa('rm', ['-f', 'package-lock.json'], { cwd }),
});

export const runNpmInstall = (cwd: string) => ({
  title: 'Running npm install',
  task: () => execa('npm', ['install'], { cwd }),
});

export const updatePackagesVersions = (cwd: string) => ({
  title: 'Updating packages versions',
  task: () => execa('npx', ['npm-check-updates', '-u', '--packageFile', 'package.json'], { cwd }),
});

export const installDependencies = (cwd: string, corePackages: string[]) => ({
  title: 'Installing packages',
  task: () => execa('npm', ['i', ...corePackages], { cwd }),
});

export const installDevDependencies = (cwd: string, devPackages: string[]) => ({
  title: 'Installing dev packages',
  task: () => execa('npm', ['i', '-D', ...devPackages], { cwd }),
});

export const initializeTypescriptCompilerConfig = (cwd: string) => ({
  title: 'Initializing TypeScript configuration',
  task: () => execa('npx', ['tsc', '--init'], { cwd }),
});

export const initializeJestConfig = (cwd: string) => ({
  title: 'Initializing ts-jest configuration',
  task: () => execa('npx', ['ts-jest', 'config:init'], { cwd }),
});

export const initializeNpmProject = (cwd: string) => ({
  title: 'Initializing npm project',
  task: () => execa('npm', ['init', '-y'], { cwd }),
});

export const createTsFile = (cwd: string) => ({
  title: 'Creating first TS file in a project',
  task: () => {
    fs.mkdirSync(path.join(cwd, 'src'), { recursive: true });
    fs.writeFileSync(path.join(cwd, 'src', 'index.ts'), `console.log('Hello TS');`);
  },
});
