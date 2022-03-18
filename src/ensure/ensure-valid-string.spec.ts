import { ensureValidString } from './ensure-valid-string';
describe('EnsureValidString', () => {
  test('Should not throw if value is undefined and there no defaultValue assigned', () => {
    let str = undefined;
    expect(() => {
      str = ensureValidString(str, {
        replace: [
          { exp: new RegExp('(\\s|-|_)+', 'gi'), value: '' },
          { exp: new RegExp('([\\d+]{3})+', 'gi'), value: '' },
        ],
      });
    }).not.toThrow();
  });
  test('Should set a default value if the string is null or undefined', () => {
    let str = null;
    str = ensureValidString(str, {
      accepts: ['1', '2'],
      defaultValue: '1',
    });
    expect(str).toBe('1');
  });
  test('Should use the input value if it exists on accepts[]', () => {
    let str = '1';
    str = ensureValidString(str, {
      accepts: ['1', '2'],
      defaultValue: '2',
    });
    expect(str).toBe('1');
  });
  test('Should replace all characters matching a given regexp', () => {
    expect(
      ensureValidString('FR 213FOO-_BAR', {
        replace: [{ exp: new RegExp('([\\d+]{3}|\\s|-|_)+', 'gi'), value: '' }],
      })
    ).toBe('FRFOOBAR');
  });
  test('Should replace all characters matching all regexp', () => {
    expect(
      ensureValidString('FR 213FOO-BAR12', {
        replace: [
          { exp: new RegExp('(\\s|-|_)+', 'gi'), value: '' },
          { exp: new RegExp('([\\d+]{3})+', 'gi'), value: '' },
        ],
      })
    ).toBe('FRFOOBAR12');
  });
  test('Should uppercase strings', () => {
    expect(
      ensureValidString('fr', {
        transform: 'upperCase',
      })
    ).toBe('FR');
  });
  test('Should lower case', () => {
    expect(
      ensureValidString('FR', {
        transform: 'lowerCase',
      })
    ).toBe('fr');
  });
});
