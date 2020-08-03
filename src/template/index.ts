import execa from 'execa';
import Listr from 'listr';

const devPackages = [
  'typescript',
  'typesync',
  'npm-check-updates',
  'ts-node',
  'prettier',
  'rimraf',
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
    { // call up instead
      title: 'Syncing types',
      task: () => execa('npx', ['typesync']),
    },
    {
      title: 'Installing packages with typings',
      task: () => execa('npm', ['install']),
    },
  ]);
  tasks.run().catch(console.error);
};

export default template;
