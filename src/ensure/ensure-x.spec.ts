import { createInstance, ensureX, EnsureOptions } from './ensure-x';

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
      expect(ensureX('bool', void 0, { defaultValue: true })).toBe(true);
      expect(ensureX('bool', -1)).toBe(void 0);
      expect(ensureX('bool', null, { allowNull: true })).toBe(null);
    });
    describe('#number', () => {
      expect(ensureX('number', -1.12, { allowNegative: true })).toBe(void 0);
      expect(ensureX('number', -1, { allowNegative: true })).toBe(-1);
      expect(ensureX('number', null, { allowNegative: true })).toBe(void 0);
      expect(
        ensureX('number', null, { allowNegative: true, allowNull: true })
      ).toBe(null);
      expect(ensureX('number', 0, { allowNegative: false })).toBe(0);
    });
    describe('#decimal', () => {
      expect(ensureX('decimal', -1.12, { allowNegative: true })).toBe(-1.12);
      expect(ensureX('decimal', -1.12, { allowNegative: false })).toBe(void 0);
      expect(ensureX('decimal', 0, { allowNegative: false })).toBe(0);
    });

    describe('#date', () => {
      expect(() =>
        ensureX('date', 'aaaa-01-01', { eMode: 'STRICT' })
      ).toThrow();
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
    it('should not throw', () => {
      expect(
        eInstanceNull('number', null, {
          allowNegative: true,
        })
      ).toBe(null);
    });
    it('should throw', () => {
      expect(() =>
        eInstanceNull('number', void 0, {
          allowNegative: true,
        })
      ).toThrow();
    });
  });
});
