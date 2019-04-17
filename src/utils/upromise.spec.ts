import { UPromise } from './upromise';

describe('UPromise', () => {
  test('it should resolve', () => {
    const c = UPromise.deferred();
    setTimeout(() => c.resolve('hello world'), 100);
    return c.promise.then(data => {
      expect(data).toBe('hello world');
    });
  });
});
