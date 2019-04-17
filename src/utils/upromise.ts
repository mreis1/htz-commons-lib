import { Deferred } from './deferred';

/**
 * A small utility class that allows you to generate a promise
 * that is resolved outside of the stack
 */
export class UPromise {
  public static deferred<T>() {
    return new Deferred<T>();
  }
}
