import execa from 'execa';
import Listr from 'listr';

const template = () => {
  const tasks = new Listr([
    {
      title: 'Installing dev packages',
      task: () =>
        execa('npm', [
          'i',
          '-D',
          'typesync',
          'typescript',
          'npm-check-updates',
          'ts-node',
          'prettier',
          'rimraf',
        ]),
    },
    {
      title: 'Installing core packages',
      task: () => execa('npm', ['i', 'axios', 'lodash']),
    },
    {
      title: 'Initializing TypeScript configuration',
      task: () => execa('npx', ['tsc', '--init']),
    },
    {
      title: 'Syncing types',
      task: () => execa('npx', ['typesync']),
    },
    {
      title: 'Installing packages with typings',
      task: () => execa('npm', ['install']),
    },
  ]);
  tasks.run().catch(console.error)
};

export default template;
