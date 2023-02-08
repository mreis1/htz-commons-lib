import { createInstance, ensure, EnsureOptions } from './ensure';

describe('ensure', () => {
  describe('Generic Ensure', () => {
    /*
    method === 'bool'
    method === 'number'
    method === 'decimal'
    method === 'string'
    method === 'time'
    method === 'date'
    method === 'dateTime'
    method === 'timestamp'
    method === 'arrayOf'
    method === 'arrayOfNumbers'
    */
    it('#bool', () => {
      expect(ensure('bool', void 0, { defaultValue: true })).toBe(true);
      expect(ensure('bool', -1)).toBe(void 0);
      expect(ensure('bool', null, { allowNull: true })).toBe(null);
    });
    describe('#number', () => {
      expect(ensure('number', -1.12, { allowNegative: true })).toBe(void 0);
      expect(ensure('number', -1, { allowNegative: true })).toBe(-1);
      expect(ensure('number', null, { allowNegative: true })).toBe(void 0);
      expect(
        ensure('number', null, { allowNegative: true, allowNull: true })
      ).toBe(null);
      expect(ensure('number', 0, { allowNegative: false })).toBe(0);
    });
    describe('#decimal', () => {
      expect(ensure('decimal', -1.12, { allowNegative: true })).toBe(-1.12);
      expect(ensure('decimal', -1.12, { allowNegative: false })).toBe(void 0);
      expect(ensure('decimal', 0, { allowNegative: false })).toBe(0);
    });

    describe('#date', () => {
      expect(() => ensure('date', 'aaaa-01-01', { eMode: 'STRICT' })).toThrow();
    });
  });
  describe('Custom instance not null', () => {
    class CustomError extends Error {
      constructor(...args) {
        super(...args);

        Object.setPrototypeOf(this, CustomError.prototype);
      }
    }
    let eInstanceNotNull = createInstance({
      eMode: 'STRICT',
      errorBuilder: (options) => {
        const x = `Field ${options.options.eField ?? '-'} has incorrect value`;
        return new CustomError(x);
      },
    });
    it('should throw', () => {
      expect(
        eInstanceNotNull('number', 0, {
          allowNegative: true,
        })
      ).toBe(0);
      expect(
        eInstanceNotNull('number', -1, {
          allowNegative: true,
        })
      ).toBe(-1);
      expect(() =>
        eInstanceNotNull('number', -1, {
          allowNegative: false,
        })
      ).toThrow();

      expect(() =>
        eInstanceNotNull('string', '', {
          eField: 'xx',
          defaultValue: 0,
        })
      ).toThrow(/Field xx has incorrect value/);
    });
  });
  describe('Custom instance null', () => {
    class CustomError extends Error {
      constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, CustomError.prototype);
      }
    }
    let eInstanceNull = createInstance({
      eMode: 'STRICT',
      allowNull: true,
      errorBuilder: (options) => {
        const x = `Field ${options.options.eField ?? '-'} has incorrect value`;
        return new CustomError(x);
      },
    });
    it('should throw', () => {
      expect(
        eInstanceNull('number', null, {
          allowNegative: true,
        })
      ).toBe(null);
    });
  });
});
