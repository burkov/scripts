import Listr from 'listr';
import {
  createPrettierConfig,
  createTsFile,
  editPackageJson,
  editTsConfig,
  initializeJestConfig,
  initializeNpmProject,
  initializeTypescriptCompilerConfig,
  installDependencies,
  installDevDependencies,
  runNpmInstall,
  runPrettier,
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
  'np',
  'ts-jest',
  '@types/jest',
  'execa',
];

const corePackages = ['axios', 'lodash'];

const template = () => {
  const cwd = '.';
  const tasks = new Listr([
    initializeNpmProject(cwd),
    editPackageJson(cwd),
    installDevDependencies(cwd, devPackages),
    installDependencies(cwd, corePackages),
    initializeTypescriptCompilerConfig(cwd),
    editTsConfig(cwd),
    initializeJestConfig(cwd),
    syncTypes(cwd),
    runNpmInstall(cwd),
    createTsFile(cwd),
    createPrettierConfig(cwd),
    runPrettier(cwd),
  ]);
  tasks.run().catch(console.error);
};

export default template;
