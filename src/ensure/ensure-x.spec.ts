import moment = require('moment');
import { createInstance, ensureX, EnsureOptions } from './ensure-x';

describe('ensure', () => {
  const eStrict = createInstance({
    eMode: 'strict',
    allowNull: false,
  });
  const eStrictNull = createInstance({
    eMode: 'strict',
    allowNull: true,
  });
  const eProvidedStrict = createInstance({
    eMode: 'strict_if_provided',
    allowNull: false,
  });
  const eProvidedStrictNull = createInstance({
    eMode: 'strict_if_provided',
    allowNull: true,
  });
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
        ensureX('date', 'aaaa-01-01', { eMode: 'strict' })
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
      eMode: 'strict',
      errorBuilder: (options) => {
        const x = `Field ${options.options.eField ?? '-'} has incorrect value`;
        return new CustomError(x);
      },
    });

    it('cast null values to something else', () => {
      expect(
        eInstanceNotNull('number', null, {
          nullTo: 'a',
        })
      ).toBe('a');
      expect(
        eInstanceNotNull('number', null, {
          nullTo: void 0,
        })
      ).toBe(void 0);
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
    // tslint:disable-next-line:max-classes-per-file
    class CustomError extends Error {
      constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, CustomError.prototype);
      }
    }
    let eInstanceNull = createInstance({
      eMode: 'strict',
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
      ).toThrow(/Field - has incorrect value/); // custom error
    });
  });

  describe('eProvidedStrictNull', () => {
    test('string', () => {
      expect(eProvidedStrictNull('string', '', { eField: 'bar' })).toBe(null);
    });
  });

  describe('eProvidedStrict', () => {
    test('string', () => {
      expect(() => eProvidedStrict('string', '', { eField: 'bar' })).toThrow(
        /Provided value bar is not a valid \"string\"./
      );
    });
    test('arrayOfNumbers', () => {
      expect(eProvidedStrict('arrayOfNumbers', void 0, { eField: 'bar' })).toBe(
        void 0
      );
      expect(() =>
        eProvidedStrict('arrayOfNumbers', null, { eField: 'bar' })
      ).toThrow(/Provided value bar is not a valid \"arrayOfNumbers\"./);
      expect(() =>
        eProvidedStrict('arrayOfNumbers', ['a'], { eField: 'bar' })
      ).toThrow(/Provided value bar is not a valid \"arrayOfNumbers\"./);
    });
    test('arrayOf', () => {
      expect(
        eProvidedStrict('arrayOf', void 0, {
          eField: 'bar',
          validatorFn: () => true,
        })
      ).toStrictEqual([]);
      expect(
        eProvidedStrict('arrayOf', void 0, {
          eField: 'bar',
          validatorFn: () => false,
        })
      ).toStrictEqual([]);
      expect(() =>
        eProvidedStrict('arrayOf', null, {
          eField: 'bar',
          validatorFn: (v) => typeof v === 'string',
        })
      ).toThrow(/Provided value bar is not a valid \"arrayOf\"./);
      expect(
        eProvidedStrict('arrayOf', ['a'], {
          eField: 'bar',
          validatorFn: (v) => typeof v === 'string',
        })
      ).toStrictEqual(['a']);
    });
  });
  describe('eStrict', () => {
    describe('arrayOfNumbers', () => {
      it('should accept valid numbers', () => {
        expect(
          eProvidedStrict('arrayOfNumbers', [1, 2], { eField: 'bar' })
        ).toEqual([1, 2]);
      })
      it('should throw if input is void', () => expect(() =>
        eStrict('arrayOfNumbers', void 0, { eField: 'bar' })
      ).toThrow(/Required field "bar" was not provided\./))
      it('should throw if input if null', () => expect(() => eStrict('arrayOfNumbers', [''], { eField: 'bar' })).toThrow(
        /Provided value bar is not a valid \"arrayOfNumbers\"./
      ))
      it('should accept empty array', () => {
        expect(eStrict('arrayOfNumbers', [], { eField: 'bar' })).toStrictEqual([]);
      })
    });
    test('arrayOf', () => {
      // @todo
      /*expect(eProvidedStrict('arrayOfNumbers', [1,2], { eField: 'bar' })).toEqual([1,2]);
      expect(() => eStrict('arrayOfNumbers', void 0, { eField: 'bar' })).toThrow(/Required field "bar" was not provided\./);
      expect(() => eStrict('arrayOfNumbers', [""], { eField: 'bar' })).toThrow(/Provided value bar is not a valid \"arrayOfNumbers\"./);*/
    });

    test('string', () => {
      expect(() => eStrict('string', '', { eField: 'bar' })).toThrow(
        /Provided value bar is not a valid \"string\"./
      );
    });
    test('Date , DateTime, Timestmap and mixes', () => {
      // Pass
      expect(
        moment.isMoment(
          eStrict('dateTime', '2022-02-10 10:00:00', { eField: 'bar' })
        )
      ).toBe(true);
      expect(
        moment.isMoment(eStrict('date', '2022-02-10', { eField: 'bar' }))
      ).toBe(true);
      expect(eStrict('time', '10:00:00', { eField: 'bar' })).toStrictEqual({
        h: 10,
        m: 0,
        s: 0,
        sTime: 36000,
        str: '10:00:00',
      });
      expect(
        moment.isMoment(
          eStrict('dateTimeOrTimestamp', '2022-02-10 10:00:00', {
            eField: 'bar',
          })
        )
      ).toBe(true);
      expect(
        moment.isMoment(
          eStrict('dateTimeOrTimestamp', '2022-02-10T10:00:00.000Z', {
            eField: 'bar',
          })
        )
      ).toBe(true);
      expect(
        moment.isMoment(
          eStrict('dateOrTimestamp', '2022-02-10', { eField: 'bar' })
        )
      ).toBe(true);
      expect(
        moment.isMoment(
          eStrict('dateOrTimestamp', '2022-02-10T10:00:00.000Z', {
            eField: 'bar',
          })
        )
      ).toBe(true);
      // Throw
      // @todo
      /*expect(eProvidedStrict('arrayOfNumbers', [1,2], { eField: 'bar' })).toEqual([1,2]);
      expect(() => eStrict('arrayOfNumbers', void 0, { eField: 'bar' })).toThrow(/Required field "bar" was not provided\./);
      expect(() => eStrict('arrayOfNumbers', [""], { eField: 'bar' })).toThrow(/Provided value bar is not a valid \"arrayOfNumbers\"./);*/
    });
  });
});
