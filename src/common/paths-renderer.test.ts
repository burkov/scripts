import { renderPaths } from './paths-renderer';

test('paths sorted correctly', () => {
  const check = (list: string[], expected: string[]) =>
    expect(renderPaths(list, { noColors: true })).toStrictEqual(expected);

  check(['a/b/c', 'b', 'd/e', 'z'], ['b', 'z', 'd / e', 'a / b / c']);
  check(['z', 'x', 'y', 'a'], ['a', 'x', 'y', 'z']);
  check(['z/a', 'x', 'y', 'a'], ['a', 'x', 'y', 'z / a']);
  check(['z', 'x', 'y', 'a/a'], ['x', 'y', 'z', 'a / a']);
});
