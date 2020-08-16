import { findProjectsAndAskConfirmation } from '../common/find-npm-projects';

export const mass = () => {
  return findProjectsAndAskConfirmation('running command', (paths) => {

  });
};
