import { mapAsync } from './map-async';

describe('mapAsync', function () {
     it('should map async well', async () => {
          async function delay(v: number) {
               return new Promise((resolve, reject) => {
                    setTimeout(() => {
                         resolve(v);
                    }, v);
               });
          }
          const o = await mapAsync(['aaa', 'bbb'], async (v, idx) => {
               await delay(idx * 1000);
               return {
                    name: v,
               };
          });
          expect(JSON.stringify(o)).toBe(`[{"name":"aaa"},{"name":"bbb"}]`);
     });

     it('should throw if fn cb is not provided', async () => {
          let err: any;
          await mapAsync(['aaa', 'bbb'], null)
               .then(() => {
                    /**/
               })
               .catch((_err) => (err = _err));
          expect(err?.message).toBe('mapAsync required fn to be a function');
     });
     it('should throw if list is not a valid array', async () => {
          let err: any;
          await mapAsync(null, null)
               .then(() => {
                    /**/
               })
               .catch((_err) => (err = _err));
          expect(err?.message).toBe('mapAsync required an array');
     });
});
