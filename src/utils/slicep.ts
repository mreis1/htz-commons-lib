/**
 *
 * Returns X characters starting at a given position
 *
 *
 *
 * @param array         The array
 * @param start         The start index
 * @param howMany       The number of characters
 */
export function sliceP(array: any[] | string, start, howMany: number) {
  return (
    (array && array.slice && array.slice(start, start + howMany)) || void 0
  );
}
