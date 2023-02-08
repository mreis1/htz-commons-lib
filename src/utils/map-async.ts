type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;

// type Keys<TypeOf> = keyof ArrElement<TypeOf>;

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type FilterByFn<T> = <R>(value: ArrElement<T>, idx: number) => Promise<R>;
// type FilterByOp<T> = Keys<T> | FilterByFn<T> | string | number | null;

// await credits to: https://stackoverflow.com/a/57364353/1084568
type Await<T> = T extends {
     then(onfulfilled?: (value: infer U) => unknown): unknown;
}
     ? U
     : T;

// declare `T` as being a any[]         T:any[] is our input data
// Then we pass a callback function that returns a promise
//   The fn argument is ArrElement<T>
//   The output of mapAsync is the output of FilterByFn<T>
type MapAsyncReturn<Y> = Await<ReturnType<Await<Y>>>[];
/**
 * Loops over each array record,
 * do whatever you need to do in each callback (async or not).
 *
 * Operations will be executed sequentially meaning:
 * we wont start cb for record 2 if cb for record 1 did not resolve.
 *
 * @param list
 * @param fn
 */
export async function mapAsync<T extends any[], Y = FilterByFn<T>>(list: T, fn: Y): Promise<MapAsyncReturn<Y>> {
     let output = [] as ReturnType<Y>[];
     if (!Array.isArray(list)) {
          throw new TypeError('mapAsync required an array');
     }
     if (typeof fn !== 'function') {
          throw new TypeError('mapAsync required fn to be a function');
     }
     let idx = 0;
     for (const r of list) {
          output.push(await fn(r, idx++));
     }
     return output as any;
}
