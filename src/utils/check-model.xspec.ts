import { checkModel, createInstance, option } from './check-model';

describe('checkModel', () => {
  describe('CustomInstance', () => {
    it('Should work', () => {
      class CustomError extends Error {
        constructor(...args) {
          super(...args);
          Object.setPrototypeOf(this, CustomError.prototype);
        }
      }
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
    });
  });
});
