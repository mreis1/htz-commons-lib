class Deferred<T>{
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor(){
        var self = this;
        this.promise = new Promise(function(resolve, reject) {
            self.reject = reject;
            self.resolve = resolve;
        })
    }
}

/**
 * A small utility class that allows you to generate a promise
 * that is resolved outside of the stack
 */
export class UPromise {
    static deferred() {
        return new Deferred();
    }
}
