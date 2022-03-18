// Conditional Types to the rescue:
// https://stackoverflow.com/a/54166010/1084568
export type ArgType = any[] | string | Buffer;
export type ResType<T extends ArgType> =
  T extends any[] ? any[] :
    T extends string ? string :
      T extends Buffer ? Buffer :
        never;

/**
 * Returns X characters starting at a given position
 *
 * const x = sliceP(Buffer.from([1,2,3]),1,1)   // Returns Buffer<0x02> a Buffer
 * const d = sliceP([1,2,3],2,1)                // Returns [3] an array of any
 * const a = sliceP('abcdefg....', 3,1)         // Returns 'd' a string
 *
 * @param value         The array
 * @param start         The start index
 * @param howMany       The number of characters
 */
export function sliceP<T extends ArgType>(value: T, start: number, howMany: number): ResType<T> {
  return value.slice(start, start + howMany) as any;
}
