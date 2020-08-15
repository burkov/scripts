import Listr from 'listr';
import execa from 'execa';
import { findProjectsAndAskConfirmation } from '../common/find-npm-projects';

export const syncTypesTasks = (paths: string[]): Listr => {
  return new Listr(
    paths.map((cwd: string) => ({
      title: `Updating types in '${cwd}'`,
      task: () =>
        new Listr([
          {
            title: 'Syncing types',
            task: () => execa('npx', ['typesync'], { cwd }),
          },
          {
            title: 'Installing packages with typings',
            task: () => execa('npm', ['install'], { cwd }),
          },
        ]),
    })),
  );
};

export const upTypes = async () => {
  await findProjectsAndAskConfirmation('Sync types?', (paths) => {
    syncTypesTasks(paths).run().catch(console.error)
  });
};

export const upRelock = async () => {
  await findProjectsAndAskConfirmation('Relock?', () => {
    console.log('up relock');
    // const tasks = new Listr(syncTypesTasks);
    // tasks.run().catch(console.error);
  });
};

export const upFull = async () => {
  await findProjectsAndAskConfirmation('Full update?', () => {
    console.log('up full');
    // const tasks = new Listr(syncTypesTasks);
    // tasks.run().catch(console.error);
  });
};
