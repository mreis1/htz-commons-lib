export class Deferred<T> {
  public promise: Promise<T>;
  public resolve: (value?: T | PromiseLike<T>) => void;
  public reject: (reason?: any) => void;
  constructor() {
    const self = this;
    this.promise = new Promise((resolve, reject) => {
      self.reject = reject;
      self.resolve = resolve;
    });
  }
}
