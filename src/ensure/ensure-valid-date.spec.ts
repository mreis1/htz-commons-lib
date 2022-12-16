import { ensureValidDate, registerRegExp } from './ensure-valid-date';
import moment = require('moment');

describe('ensure-valid-date.spec.ts', function () {
  describe('#Using basic signature', function () {
    test('A Date object should be reused if provided', function () {
      let d = new Date();
      expect(ensureValidDate(d)).toBeDefined();
    });
    test('A Moment object should be reused if provided', function () {
      let d = moment();
      let r = ensureValidDate(d);
      let formatStr = 'YYYY-MM-DD';
      expect(r).toBeDefined();
      expect(r.format(formatStr)).toEqual(d.format(formatStr));
    });
    test('A string should be parsed as YYYY-MM-DD', function () {
      let input = '2019-06-20';
      let r = ensureValidDate(input);
      let formatStr = 'YYYY-MM-DD';
      expect(r && r.format(formatStr)).toEqual(input);
    });

    describe('With default settings', () => {
      describe('considering the default inputFormat (YYYY-MM-DD) and no format verification', () => {
        it('should return defaultValue if expression is un-parsable', function () {
          let input = '16-13-2022'; // <-- This is invalid considering the default format (YYYY-MM-DD)
          expect(ensureValidDate(input)).toEqual(void 0);
        });
        /**
         * !! Notice !!
         * This example, shows why we must specify a onInvalidFormat
         */
        test('should return defaultValue if cant parse date expression', function () {
          let input = '2016-12-2022'; // <-- This is invalid considering the default format (YYYY-MM-DD)
          expect(ensureValidDate(input).format('YYYY-MM-DD')).toEqual(
            '2016-12-20'
          );
        });
      });

      describe('considering the default inputFormat (YYYY-MM-DD) and having format verification', () => {
        it('should return defaultValue if expression is un-parsable', function () {
          let input = '16-13-2022'; // <-- This is invalid considering the default format (YYYY-MM-DD)
          expect(
            ensureValidDate(input, { onInvalidStringFormat: 'defaultValue' })
          ).toEqual(void 0);
        });

        it('should throw if expression is un-parsable', function () {
          let input = '16-15-2022'; // <-- This is invalid considering the default format (YYYY-MM-DD)
          expect(() =>
            ensureValidDate(input, { onInvalidStringFormat: 'throw' })
          ).toThrowError(/Input value has incorrect format/);
        });

        it('should throw if expression is un-parsable', function () {
          let input = '16-15-2022'; // <-- This is invalid considering the default format (YYYY-MM-DD)
          expect(() =>
            ensureValidDate(input, {
              onInvalidStringFormat: 'throw',
              inputFormat: 'DD-MM-YY',
            })
          ).toThrowError(/No RegExp available for format/);
        });

        /**
         * !! Notice !!
         * This example, shows why we must specify a onInvalidFormat
         */
        test('should return defaultValue if cant parse date expression', function () {
          expect(ensureValidDate('2016-12-2022').format('YYYY-MM-DD')).toEqual(
            '2016-12-20'
          );
        });
      });

      describe('#Custom formats', () => {
        registerRegExp('DD-MM-YYYY', ['^[\\d+]{2,2}-[\\d+]{2,2}-[\\d+]{4,4}$']);

        describe('#SimpleOptions', () => {
          describe('Passing a moment as a default value', () => {
            const d = ensureValidDate('', moment());
            expect(moment.isMoment(d)).toBe(true);
          });
          describe('Passing a date as a default value', () => {
            const d = ensureValidDate('', new Date());
            expect(moment.isDate(d)).toBe(true);
          });
          describe('Passing a string as a default value', () => {
            const d = ensureValidDate('', '2022-10-12');
            expect(d).toBe('2022-10-12');
          });

          it('should should register custom formats', function () {
            expect(() =>
              ensureValidDate('2022-31-12', void 0, 'DD-MM-YYYY', {
                onInvalidStringFormat: 'throw',
              })
            ).toThrowError(/Input value has incorrect format/);
          });

          it('should validate against custom format', () => {
            expect(
              ensureValidDate('30-12-2022', void 0, 'DD-MM-YYYY', {
                onInvalidStringFormat: 'throw',
              }).format('DD-MM-YYYY')
            ).toBe('30-12-2022');
          });
        });
        describe('#Options', () => {
          it('should should register custom formats', function () {
            expect(() =>
              ensureValidDate('2022-31-12', {
                onInvalidStringFormat: 'throw',
                inputFormat: 'DD-MM-YYYY',
              })
            ).toThrowError(/Input value has incorrect format/);
          });

          it('should validate against custom format', () => {
            expect(
              ensureValidDate('30-12-2022', {
                onInvalidStringFormat: 'throw',
                inputFormat: 'DD-MM-YYYY',
              }).format('DD-MM-YYYY')
            ).toBe('30-12-2022');
          });
        });
      });

      describe('#AllowNull', () => {
        describe('#DefaultConfig', () => {
          it('Should not allow null values', () => {
            expect(ensureValidDate(null, void 0)).toBe(void 0);
            expect(ensureValidDate(null, {})).toBe(void 0);
            expect(ensureValidDate(null, {}, null, {})).toBe(void 0);
          });
        });
        describe('#SimpleOptions', () => {
          it('should handle allowNull', () => {
            expect(
              ensureValidDate(null, void 0, null, {
                allowNull: true,
              })
            ).toBe(null);
            expect(
              ensureValidDate(null, void 0, null, {
                allowNull: false,
              })
            ).toBe(void 0);
            expect(ensureValidDate(null, void 0, null, {})).toBe(void 0);
          });
        });
        describe('#Options', () => {
          it('should handle allowNull', () => {
            expect(
              ensureValidDate(null, {
                allowNull: true,
              })
            ).toBe(null);
            expect(ensureValidDate(null, { allowNull: false })).toBe(void 0);
            expect(ensureValidDate(null, {})).toBe(void 0);
          });
        });
      });
    });

    test('An invalid string date should throw.', function () {
      let input = '2022-12-13T09:00:28.371Z';
      let r = ensureValidDate(input);
      let formatStr = 'YYYY-MM-DD';
      expect(r && r.format(formatStr)).toEqual('2022-12-13');
    });
  });
  describe('#New Features', () => {});
});
