import Listr from 'listr';
import execa from 'execa';

export const syncTypesTasks = [
  {
    // call up instead
    title: 'Syncing types',
    task: () => execa('npx', ['typesync']),
  },
  {
    title: 'Installing packages with typings',
    task: () => execa('npm', ['install']),
  },
];

const up = () => {
  const tasks = new Listr(syncTypesTasks);
  tasks.run().catch(console.error);
};

export default up;
