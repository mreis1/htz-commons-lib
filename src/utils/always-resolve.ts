export interface IAlwaysResolveRes<T, Y> {
  err: any | Y;
  data: T;
}

type AlwaysResolvePromiseFn<T> = () => Promise<T>;
type AlwaysResolveNoPromiseFn<T> = () => T;
export type AlwaysResolvePromiseCall<T> =
  | Promise<T>
  | AlwaysResolvePromiseFn<T>;
export type AlwaysResolveNoPromiseCall<T> = T | AlwaysResolveNoPromiseFn<T>;
/**
 * An utility function that takes a promise and always resolve with a common object structure:
 *
 * ```
 * {
 *      err: null | AppError | Error,        // The error if promise was rejected
 *      data: any                            // The data if promise was resolved
 * }
 * ```
 *
 */
export function alwaysResolve<T, Y>(
  v: AlwaysResolvePromiseCall<T> | AlwaysResolveNoPromiseCall<T>,
  opts?: {
    /**
     * When true, only promises will be accepted.
     * Passing a function that returns something other than a promise will resolve with data.err
     * where result.err.message will be `INVALID_PROMISE`.
     */
    promiseOnly: boolean;
  }
): Promise<IAlwaysResolveRes<T, Y>>;
export function alwaysResolve(
  v: any,
  opts?: {
    /**
     * When true, only promises will be accepted.
     * Passing a function that returns something other than a promise will resolve with data.err
     * where result.err.message will be `INVALID_PROMISE`.
     */
    promiseOnly: boolean;
  }
): any {
  return new Promise((resolve) => {
    switch (typeof v) {
      case 'function':
        try {
          let o = v();
          if (o instanceof Promise) {
            o.then((data) => resolve({ err: null, data })).catch((err) =>
              resolve({ err, data: null })
            );
          } else {
            !opts?.promiseOnly
              ? resolve({ err: null, data: o })
              : resolve({ err: new TypeError('INVALID_PROMISE'), data: null });
          }
        } catch (err) {
          resolve({ err, data: null });
        }
        break;
      case 'object':
      default:
        if (v instanceof Promise) {
          v.then((data) => resolve({ err: null, data })).catch((err) =>
            resolve({ err, data: null })
          );
        } else {
          !opts?.promiseOnly
            ? resolve({ err: null, data: v })
            : resolve({ err: new TypeError('INVALID_PROMISE'), data: null });
        }
    }
  });
}
