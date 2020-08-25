import Listr from 'listr';
import {
  initializeJestConfig, initializeNpmProject,
  initializeTypescriptCompilerConfig,
  installDependencies,
  installDevDependencies,
  runNpmInstall,
  syncTypes,
} from '../common/commands';

const devPackages = [
  'typescript',
  'typesync',
  'npm-check-updates',
  'ts-node',
  'prettier',
  'rimraf',
  'jest',
  'ts-jest',
  '@types/jest',
];

const corePackages = ['axios', 'lodash'];

const template = () => {
  const cwd = '.';
  const tasks = new Listr([
    initializeNpmProject(cwd),
    installDevDependencies(cwd, devPackages),
    installDependencies(cwd, corePackages),
    initializeTypescriptCompilerConfig(cwd),
    initializeJestConfig(cwd),
    syncTypes(cwd),
    runNpmInstall(cwd),
  ]);
  tasks.run().catch(console.error);
};

export default template;
