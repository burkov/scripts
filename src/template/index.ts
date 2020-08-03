import execa from 'execa';

const template = () => {
  execa.sync('npm', [
    'i',
    '-D',
    'typesync',
    'typescript',
    'npm-check-updates',
    'ts-node',
    'prettier',
    'rimraf',
  ]);
  execa.sync('npm', ['i', 'axios', 'lodash']);
};

export default template;
