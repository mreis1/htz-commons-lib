import { checkModel, createInstance, option } from './check-model';
class CustomError extends Error {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

describe('checkModel', () => {
  describe('CustomInstanceAsync', () => {
    let o = createInstance({
      async: true,
      errorBuilder: (options) => {
        const x = `Field ${options.options.eField ?? '-'} has incorrect value`;
        return new CustomError(x);
      },
    });
    it('should test', async () => {
      let x: any;
      await o(
        {
          foo: ' AA ',
        },
        {
          foo: option('string+upper+trim', {
            mode: 'strict',
            allowNull: true,
          }),
        }
      ).then(data => x = data); // explictly using then to make sure i'm dealing with a promise.
      expect(x.foo).toBe('AA');
    });
  });
  describe('CustomInstance', () => {
    it('Should work', () => {
      let o = createInstance({
        errorBuilder: (options) => {
          const x = `Field ${
            options.options.eField ?? '-'
          } has incorrect value`;
          return new CustomError(x);
        },
      });
      // returns a list of properties with incorrect value
      // simple (@default) - Returns the sanitized model and throws on first error
      let oRes = o(
        {
          dog: 'test',
          age: 12,
        },
        {
          dog: option('string', {
            mode: 'soft',
            // type: 'string',
            allowNull: true,
            options: {
              defaultValue: null, // <--- Set invalid
              maxLength: 2,
            },
          }),
          age: void 0,
        },
        {}
      );
      expect(oRes.dog).toBe(null);
      expect(oRes.age).toBe(undefined); // undefined because no definition was provided for age

      expect(() =>
        o(
          {
            dog: 'te2',
            age: 12,
          },
          {
            dog: option('string', {
              mode: 'strict',
              // type: 'string',
              allowNull: true,
              options: {
                defaultValue: null,
                maxLength: 2,
              },
            }),
            age: option('number', {
              mode: 'soft',
              options: {
                allowNegative: true,
              },
              allowNull: true,
            }),
          }
        )
      ).toThrow(/Field dog has incorrect value/);

      expect(() =>
        o(
          {
            email: 'te2',
          },
          {
            email: option('email', {
              mode: 'strict',
              // type: 'string',
              allowNull: true,
              options: {
                // defaultValue: null,
                // maxLength: 2,
              },
            }),
          }
        )
      ).toThrow(/Field email has incorrect value/);

      expect(
        o(
          {
            email: 'TEST2@foo.bar',
          },
          {
            email: option('email', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).email
      ).toBe('test2@foo.bar');

      expect(
        o(
          {
            strUpperTrim: ' foo ',
          },
          {
            strUpperTrim: option('string+upper+trim', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).strUpperTrim
      ).toBe('FOO');

      expect(
        o(
          {
            strUpperTrim: ' FOO ',
          },
          {
            strUpperTrim: option('string+lower+trim', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).strUpperTrim
      ).toBe('foo');

      expect(
        o(
          {
            strUpperTrim: ' FOO ',
          },
          {
            strUpperTrim: option('string+lower', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).strUpperTrim
      ).toBe(' foo ');

      expect(
        o(
          {
            strUpperTrim: ' foo ',
          },
          {
            strUpperTrim: option('string+upper', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).strUpperTrim
      ).toBe(' FOO ');

      expect(
        o(
          {
            strUpperTrim: ' Foo ',
          },
          {
            strUpperTrim: option('string+trim', {
              mode: 'strict',
              allowNull: true,
              options: {},
            }),
          }
        ).strUpperTrim
      ).toBe('Foo');

      //region Bool
      expect(
        o(
          {
            foo: true,
          },
          {
            foo: option('bool', {
              mode: 'strict',
            }),
          }
        ).foo
      ).toBe(true);
      //endregion
    });
  });
});
