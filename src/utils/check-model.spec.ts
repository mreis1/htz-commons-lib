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
      ).then((data) => (x = data)); // explictly using then to make sure i'm dealing with a promise.
      expect(x.foo).toBe('AA');
    });
  });
  describe('CustomInstance', () => {
    let o = createInstance({
      errorBuilder: (options) => {
        const x = `Field ${options.options.eField ?? '-'} has incorrect value`;
        return new CustomError(x);
      },
    });

    it('should verify strict fields even if they are not provided in source payload', () => {
      expect(() => {
        try {
          o(
            {
              age: 12, // <-- notice
            },
            {
              dog: option('string', {
                mode: 'strict',
              }),
              age: option('number', {
                mode: 'strict',
              }),
            },
            {}
          );
        } catch (err) {
          console.log(err);
          throw err;
        }
      }).toThrow();
    });

    it('should discard unknown payload properties or properties without definition', () => {
      // # Test1
      let r = o(
        {
          dog: 'my_dog_name',
          age: 12, // <-- notice
        },
        {
          dog: option('string', {
            mode: 'strict',
          }),
          age: option('number', {
            mode: 'strict',
          }),
        },
        {}
      );
      expect(r.dog).toBe('my_dog_name');
      expect(r.age).toBe(12);
      // # Test2
      r = o(
        {
          dog: null,
          age: 12, // <-- notice
        },
        {
          dog: option('string', {
            mode: 'strict',
            allowNull: true,
          }),
          age: void 0,
        },
        {}
      );
      expect(r.dog).toBe(null);
      expect(r.age).toBe(void 0);
      // # Test3
    });

    it('Should work', () => {
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
    describe('nullTo', () => {
      it('Should cast null values into something else', () => {
        {
          let x = o(
            {
              foo: null,
              bar: null,
              nullToNum: null,
              nullToStr: null,
            },
            {
              foo: option('bool', {
                mode: 'strict',
                nullTo: void 0,
              }),
              bar: option('bool', {
                mode: 'strict',
                nullTo: null,
              }),
              nullToNum: option('bool', {
                mode: 'strict',
                nullTo: 1,
              }),
              nullToStr: option('string', {
                mode: 'strict',
                nullTo: 'x',
              }),
            }
          );

          expect(x.foo).toBe(void 0);
          expect(x.bar).toBe(null);
          expect(x.nullToNum).toBe(1);
          expect(x.nullToStr).toBe('x');
        }
      });
    });
  });
});
