import path from 'path';
// @ts-ignore
import findit from 'findit';

const excludeFromSearch = ['.git', '.idea', 'node_modules', 'kotlin', 'build'];

export const findNpmRoots = (): Promise<string[]> => {
  return new Promise((resolve) => {
    const result: string[] = [];
    const finder = findit('.');
    finder.on('directory', function (dir: string, stat: any, stop: () => void) {
      const base = path.basename(dir);
      if (excludeFromSearch.includes(base)) stop();
    });

    finder.on('file', function (file: string, stat: any) {
      if (file.includes('package.json')) result.push(path.dirname(file));
    });

    finder.on('end', function () {
      resolve(result.map((e) => e.trim()).filter((e) => e.length > 0));
    });
  });
};
