import { objectByString } from './object-by-string';

export function sortByKey(list, key: string, sortOrder: 'ASC' | 'DESC') {
  sortOrder = sortOrder || 'ASC';
  if (
    typeof sortOrder === 'string' &&
    Array.isArray(list) &&
    ['ASC', 'DESC'].indexOf(sortOrder) >= 0
  ) {
    let output = [].concat(list);
    if (sortOrder === 'ASC') {
      output.sort((a, b) =>
        objectByString(a, key) > objectByString(b, key) ? 1 : -1
      );
    } else {
      output.sort((a, b) =>
        objectByString(a, key) > objectByString(b, key) ? -1 : 1
      );
    }
    return output;
  } else {
    throw new Error('Invalid call to sortByKey');
  }
}
