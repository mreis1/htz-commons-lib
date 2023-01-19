import {
  createInstance,
  ensureValidDate as _ensureValidDate,
  ensureValidDateStrict,
  ensureValidTimestampStrict,
  registerRegExp,
} from './ensure-valid-date';
import moment = require('moment');

// describe('#x()', () => {
//   it('should should register custom formats', function () {
//     expect(() =>
//       {
//         registerRegExp('DD-MM-YYYY', ['^[\\d+]{2,2}-[\\d+]{2,2}-[\\d+]{4,4}$']);
//         ensureValidDate('2022-31-12', void 0, 'DD-MM-YYYY', {
//           onInvalidStringFormat: 'throw',
//         });
//       }
//     ).toThrowError(/Input value has incorrect format/);
//   });
// });
describe('ensure-valid-date.spec.ts', function () {
  /**
   * Defaults ARE:
   */
  describe('Using #defaults', function () {
    const ensureValidDate = _ensureValidDate;
    test('foo', () => {
      const o = ensureValidDate('2022-02-02');
      expect(moment.isMoment(o)).toBe(true);
      expect(moment.isMoment(ensureValidDate('2022-12-13T09:00:28.371Z'))).toBe(
        true
      );
    });
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
    test('A valid string input should return a moment instance', function () {
      expect(moment.isMoment(ensureValidDate('2022-10-01'))).toBe(true);
    });
    test('The default parse format for strings must be YYYY-MM-DD', function () {
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
          expect(ensureValidDate(input)).toBe(void 0);
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
          expect(ensureValidDate('2016-12-2022')).toEqual(void 0);
          expect(ensureValidDate('2016-12-2022', 'foo')).toEqual('foo');
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
            expect(ensureValidDate(null, {}, null, {})).toStrictEqual({});
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
    test('An timestamp string should be parsed by moment if .', function () {
      let input = '2022-12-13T09:00:28.371Z';
      let r = ensureValidDate(input);
      let formatStr = 'YYYY-MM-DD';
      expect(r && r.format(formatStr)).toEqual('2022-12-13');
    });

    test('General Tests', () => {
      expect(ensureValidDate(null, 'xx')).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: false, defaultValue: 'xx' })
      ).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: true, defaultValue: 'xx' })
      ).toBe(null);
      expect(ensureValidDate(null, { allowNull: true })).toBe(null);
      expect(ensureValidDate(new Date().toString())).not.toBe(void 0);
      // ---
      let src = '2023-01-19T09:37:23.668Z';
      let o = ensureValidDate(src);
      expect(moment.isMoment(o)).toBe(true);
      expect(o.toISOString()).toBe(src);
      // ---
      src = '2022-01-20';
      o = ensureValidDate(src);
      expect(moment.isMoment(o)).toBe(true);
      expect(o.format('YYYY-MM-DD')).toBe(src);
      // ---
      src = '01-01-2020';
      o = ensureValidDate(src);
      expect(moment.isMoment(o)).toBe(true);
      expect(o.format('DD-MM-YYYY')).toBe(src);
      // ---
      expect(ensureValidDate('2022-01-20').format('YYYY-MM-DD')).toBe(
        '2022-01-20'
      );
      // ---
      src = new Date().toISOString();
      expect(ensureValidDate(src, 'a').toISOString()).toBe(src);
      // ---
      src = '2023-01-19T09:37:23.668Z-INVALID'; // <--- this is invalid string
      expect(
        ensureValidDate(src, {
          defaultValue: 'a',
        })
      ).toBe('a');
    });
  });

  describe('#createInstance to generate a strict method', () => {
    const ensureValidDate = createInstance({
      onInvalidStringFormat: 'defaultValue',
      inputFormat: 'YYYY-MM-DD',
      allowNull: false,
    });
    test('General Tests', () => {
      expect(ensureValidDate(null, 'xx')).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: false, defaultValue: 'xx' })
      ).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: true, defaultValue: 'xx' })
      ).toBe(null);
      expect(ensureValidDate(null, { allowNull: true })).toBe(null);
      expect(ensureValidDate(new Date().toString())).toBe(void 0);
      expect(ensureValidDate('2023-01-19T09:37:23.668Z')).toBe(void 0);
      expect(ensureValidDate('2022-01-200')).toBe(undefined);
      expect(ensureValidDate('01-01-2020')).toBe(undefined);
      expect(ensureValidDate('2022-01-20').format('YYYY-MM-DD')).toBe(
        '2022-01-20'
      );
      expect(ensureValidDate(new Date().toString(), 'a')).toBe('a');
      expect(
        ensureValidDate(new Date().toString(), {
          defaultValue: 'a',
        })
      ).toBe('a');
    });
  });

  describe('#ensureValidDateStrict', () => {
    const ensureValidDate = ensureValidDateStrict;
    test('General Tests', () => {
      let o: any;
      expect(ensureValidDate(null, 'xx')).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: false, defaultValue: 'xx' })
      ).toBe('xx');
      expect(
        ensureValidDate(null, { allowNull: true, defaultValue: 'xx' })
      ).toBe(null);
      expect(ensureValidDate(null, { allowNull: true })).toBe(null);
      expect(ensureValidDate(new Date().toString())).toBe(void 0);
      expect(ensureValidDate('2023-01-19T09:37:23.668Z')).toBe(void 0);
      expect(ensureValidDate('2022-01-200')).toBe(undefined);
      expect(ensureValidDate('01-01-2020')).toBe(undefined);
      expect(ensureValidDate('2022-01-20').format('YYYY-MM-DD')).toBe(
        '2022-01-20'
      );
      expect(ensureValidDate(new Date().toString(), 'a')).toBe('a');
      expect(
        ensureValidDate(new Date().toString(), {
          defaultValue: 'a',
        })
      ).toBe('a');
    });
  });

  describe('#ensureValidTimestampStrict()', () => {
    const x = ensureValidTimestampStrict;
    test('General Tests', () => {
      expect(x(null, 'xx')).toBe('xx');
      expect(x(null, { allowNull: false, defaultValue: 'xx' })).toBe('xx');
      expect(x(null, { allowNull: true, defaultValue: 'xx' })).toBe(null);
      expect(x(null, { allowNull: true })).toBe(null);
      expect(x(new Date().toString())).toBe(void 0);
      // --
      let src = '2023-01-19T09:37:23.668Z';
      expect(x(src).toISOString()).toBe(src);
      // --
      expect(x('2022-01-200')).toBe(undefined);
      expect(x('01-01-2020')).toBe(undefined);
      expect(x('2022-01-20')).toBe(void 0);
      expect(x(new Date().toString(), 'a')).toBe('a');
      expect(
        x(new Date().toString(), {
          defaultValue: 'a',
        })
      ).toBe('a');
    });
  });
});
