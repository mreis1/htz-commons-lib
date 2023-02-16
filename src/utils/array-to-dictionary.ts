export function ArrayKeyBy<T>(
  list,
  key
): {
  [key: string]: T[];
} {
  let r = {};
  if (list && list.length >= 1 && key) {
    list.forEach((listItem) => {
      if (!(listItem[key] === void 0 || listItem[key] === null)) {
        r[listItem[key]] = r[listItem[key]] || [];
        r[listItem[key]].push(listItem);
      }
    });
  }
  return r;
}

export type ReturnType<T, N extends any[]> = T extends true
  ? { [key: string]: N }
  : T extends false
  ? { [key: string]: N[number] }
  : // never;
    { [key: string]: N[number] };

/**
 *
 * Note: Notice that in order to tell typescript what's the default value of
 *   "asArray?: Y"
 *
 * we had to see it as: "Y extends boolean = false"
 * since
 *   "asArray: Y = false" doesn't work
 *
 * @param list
 * @param key
 * @param asArray
 * @param keepFirst
 * @constructor
 */
export function arrayToDictionaryBy<T extends any[], Y extends boolean = false>(
  list: T,
  key: keyof T[number],
  asArray?: Y,
  /**
   * Keeps first value matching the key.
   * Requires asArray to be true.
   * @default: false
   */
  keepFirst?: boolean
): ReturnType<Y, T> {
  const r: any = {};
  if (list && list.length >= 1 && key) {
    list.forEach((listItem) => {
      if (!(listItem[key] === void 0 || listItem[key] === null)) {
        // catch the id
        if (asArray) {
          r[listItem[key]] = r[listItem[key]] || [];
          r[listItem[key]].push(listItem);
        } else {
          // We are dealing with an object where the key is value of each existing object "key" provided
          // Check if key / value already exists.
          if (r[listItem[key]] === void 0) {
            r[listItem[key]] = listItem;
          } else {
            if (!keepFirst) {
              r[listItem[key]] = listItem;
            }
          }
        }
      }
    });
  }
  return r;
}
