import execa from 'execa';
import Listr from 'listr';
import { syncTypesInMultipleDirs } from '../up';

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
  const tasks = new Listr([
    {
      title: 'Installing dev packages',
      task: () => execa('npm', ['i', '-D', ...devPackages]),
    },
    {
      title: 'Installing core packages',
      task: () => execa('npm', ['i', ...corePackages]),
    },
    {
      title: 'Initializing TypeScript configuration',
      task: () => execa('npx', ['tsc', '--init']),
    },
    {
      title: 'Initializing ts-jest configuration',
      task: () => execa('npx', ['ts-jest', 'config:init']),
    },
    {
      title: 'Updating types',
      task: () => syncTypesInMultipleDirs(['.']),
    },
  ]);
  tasks.run().catch(console.error);
};

export default template;
