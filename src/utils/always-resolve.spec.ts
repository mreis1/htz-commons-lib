import { alwaysResolve } from './always-resolve';

describe('alwaysResolve', function () {
  /*
          console.log(await alwaysResolve(1, { promiseOnly: true }));
          console.log(await alwaysResolve(() => 1, { promiseOnly: true }));

          console.log(await alwaysResolve(1, { promiseOnly: false }));
          console.log(await alwaysResolve(() => 1, { promiseOnly: false }));

          console.log(await alwaysResolve(() =>
                    new Promise((resolve) => resolve(1)),
               { promiseOnly: true }));

          console.log(await alwaysResolve(() =>
                    new Promise((resolve, reject) => reject(new Error('Test'))),
               { promiseOnly: true }));

          console.log(await alwaysResolve(() => {
               return 1 as any;
          }, { promiseOnly: true }))

          console.log(await alwaysResolve(() => {
               return 1 as any;
          }, { promiseOnly: true }))

     * */
  describe('Non promise input values', () => {
    it('should resolve with INVALID_PROMISE', async function () {
      let o = await alwaysResolve(1, { promiseOnly: true });
      expect(o.err?.message).toBe('INVALID_PROMISE');

      o = await alwaysResolve(() => 1, { promiseOnly: true });
      expect(o.err?.message).toBe('INVALID_PROMISE');
    });
    it('should resolve with the non promise value', async function () {
      let o = await alwaysResolve(1, { promiseOnly: false });
      expect(o.err).toBe(null);

      o = await alwaysResolve(1);
      expect(o.err).toBe(null);

      o = await alwaysResolve(() => 1, { promiseOnly: false });
      expect(o.err).toBe(null);

      o = await alwaysResolve(() => 1);
      expect(o.err).toBe(null);
    });
  });

  describe('Promise input values', () => {
    describe('rejected', () => {
      it('should resolve with true', async function () {
        let o = await alwaysResolve(Promise.resolve(true));
        expect(o.err).toBe(null);
        expect(o.data).toBe(true);

        o = await alwaysResolve(() => Promise.resolve(true));
        expect(o.err).toBe(null);
        expect(o.data).toBe(true);
      });
      it('should resolve with err', async function () {
        let o: any = await alwaysResolve(Promise.reject('TEST'));
        expect(o.err).toBe('TEST');
        expect(o.data).toBe(null);

        o = await alwaysResolve(() => Promise.reject('TEST'));
        expect(o.err).toBe('TEST');
        expect(o.data).toBe(null);
      });
    });
  });
});
