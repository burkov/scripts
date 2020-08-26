import execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';
import editJsonFile from 'edit-json-file';

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
  title: 'Initializing Jest configuration',
  task: () => execa('npx', ['ts-jest', 'config:init'], { cwd }),
});

export const initializeNpmProject = (cwd: string) => ({
  title: 'Initializing npm project',
  task: () => execa('npm', ['init', '-y', '--scope', '@aburkov'], { cwd }),
});

export const createTsFile = (cwd: string) => ({
  title: 'Creating first TS file in a project',
  task: () => {
    fs.mkdirSync(path.join(cwd, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(cwd, 'src', 'index.ts'),
      `#!/usr/bin/env node
console.log('Hello TS');`,
    );
  },
});

export const createPrettierConfig = (cwd: string) => ({
  title: 'Creating prettier config',
  task: () => {
    fs.writeFileSync(
      path.join(cwd, '.prittierrc.js'),
      `module.exports = {
    printWidth: 100,
    singleQuote: true,
    trailingComma: 'all',
};`,
    );
  },
});

export const createUpdateVersionScript = (cwd: string) => ({
  title: 'Creating update-version.ts script',
  task: () => {
    fs.writeFileSync(
      path.join(cwd, 'update-version.ts'),
      `#!/usr/bin/env node

import nconf from 'nconf';
import gitRepoInfo from 'git-repo-info';
import execa from 'execa';

const repoInfo = gitRepoInfo();

nconf.file('src/config.json');
nconf.set('version', repoInfo.lastTag);
nconf.save(undefined);
execa.sync('git', ['commit', '-a', '-m Update version in a config file']);
execa.commandSync('git push');
`,
    );
  },
});

export const editTsConfig = (cwd: string) => ({
  title: 'Editing tsconfig.json',
  task: () => {
    const file = editJsonFile(path.join(cwd, 'tsconfig.json'));
    file.set('compilerOptions.outDir', './lib');
    file.set('compilerOptions.rootDir', './src');
    file.save();
  },
});

export const runPrettier = (cwd: string) => ({
  title: 'Running prettier',
  task: () => execa('npm', ['run', 'prettier'], { cwd }),
});

export const editPackageJson = (cwd: string) => ({
  title: 'Editing package.json',
  task: () => {
    const file = editJsonFile(path.join(cwd, 'package.json'));
    file.set('author', 'abu');
    file.set('license', 'MIT');
    file.set('main', 'lib/index.js');
    file.set('files', ['lib']);
    file.set('bin', { [path.basename(path.resolve(cwd))]: 'lib/index.js' });
    file.set('types', 'lib/index.d.ts');
    file.set('publishConfig', {
      access: 'public',
    });
    file.set('scripts', {
      'ship:patch': 'np --yolo --no-release-draft --no-2fa patch && npm link --force',
      'ship:minor': 'np --yolo --no-release-draft --no-2fa minor && npm link --force',
      prettier: 'prettier --write "src/**/*.ts*"',
      test: 'jest',
      build: 'rimraf ./lib && tsc',
      postversion: 'ts-node update-version.ts',
      prepublishOnly: 'npm run build',
    });
    file.save();
  },
});
