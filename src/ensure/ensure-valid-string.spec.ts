import { ensureValidString } from './ensure-valid-string';
describe('EnsureValidString', () => {
  test('Should not throw if value is undefined and there no defaultValue assigned', () => {
    expect(() => {
      ensureValidString(undefined, {
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

  describe('Basic call', () => {
    test('undefined + defaultValue', () => {
      expect(ensureValidString(void 0, 'foo')).toBe('foo');
    });
  });

  describe('#minLength', () => {
    it('should be length', () => {
      expect(ensureValidString('')).toBe(void 0);
    });
    it('should accept minLength: 0', () => {
      expect(
        ensureValidString('', {
          minLength: 0,
        })
      ).toBe('');
      expect(
        ensureValidString('', {
          defaultValue: 'XX',
        })
      ).toBe('XX');

      expect(
        ensureValidString(1 as any, {
          minLength: 0,
        })
      ).toBe(void 0);
    });
  });

  describe('#accepts', () => {
    it('should return the value because it exists in accepts', () => {
      expect(
        ensureValidString('1', {
          accepts: ['1', '2'],
          defaultValue: '3',
        })
      ).toBe('1');
    });
    it('should return default value because it doesnt exists in accepts', () => {
      expect(
        ensureValidString('3', {
          accepts: ['1', '2'],
          defaultValue: '3',
        })
      ).toBe('3');
    });
  });

  describe('#rejects', () => {
    it('should return default because it exists in rejects', () => {
      expect(
        ensureValidString('1', {
          rejects: ['1', '2'],
          defaultValue: '3',
        })
      ).toBe('3');
    });
    it('should return value because it doesnt exists in rejects', () => {
      expect(
        ensureValidString('0', {
          rejects: ['1', '2'],
          defaultValue: '3',
        })
      ).toBe('0');
    });
  });

  describe('#replace', () => {
    it('should replace all characters matching all regexp', () => {
      expect(
        ensureValidString('FR 213FOO-BAR12', {
          replace: [
            { exp: new RegExp('(\\s|-|_)+', 'gi'), value: '' },
            { exp: new RegExp('([\\d+]{3})+', 'gi'), value: '' },
          ],
        })
      ).toBe('FRFOOBAR12');
    });
    it('should replace all characters matching a given regexp', () => {
      expect(
        ensureValidString('FR 213FOO-_BAR', {
          replace: [
            { exp: new RegExp('([\\d+]{3}|\\s|-|_)+', 'gi'), value: '' },
          ],
        })
      ).toBe('FRFOOBAR');
    });
  });
  describe('#transform', () => {
    test('> lowerCase', () => {
      expect(
        ensureValidString('FR', {
          transform: 'lowerCase',
        })
      ).toBe('fr');
    });
    test('> lowerCase', () => {
      expect(
        ensureValidString(void 0, {
          transform: 'lowerCase',
        })
      ).toBe(void 0);
    });
    test('> uppercase', () => {
      expect(
        ensureValidString('fr', {
          transform: 'upperCase',
        })
      ).toBe('FR');
    });
    test('> uppercase', () => {
      expect(
        ensureValidString(void 0, {
          transform: 'upperCase',
        })
      ).toBe(void 0);
    });
  });

  test('#trim', () => {
    // default
    expect(ensureValidString(' FR ', {})).toBe(' FR ');

    // true
    expect(
      ensureValidString(' FR ', {
        trim: true,
      })
    ).toBe('FR');

    // false
    expect(
      ensureValidString(' FR ', {
        trim: false,
      })
    ).toBe(' FR ');
  });

  test('#allowNull', () => {
    // default
    expect(ensureValidString(null, {})).toBe(void 0);

    // true
    expect(
      ensureValidString(null, {
        allowNull: true,
      })
    ).toBe(null);

    // false
    expect(
      ensureValidString(null, {
        allowNull: false,
      })
    ).toBe(void 0);
  });

  test('#maxLength && onMaxLengthKo', () => {
    let input = '12345678901234567890';

    expect(
      ensureValidString(input, {
        maxLength: 10,
      })
    ).toBe(void 0);

    expect(
      ensureValidString(input, {
        maxLength: 10,
        onMaxLengthKo: 'useDefault',
      })
    ).toBe(void 0);

    expect(
      ensureValidString(input, {
        maxLength: 10,
        onMaxLengthKo: 'slice',
      })
    ).toBe(input.slice(0, 10));

    expect(() =>
      ensureValidString(input, {
        maxLength: 10,
        onMaxLengthKo: 'throw',
      })
    ).toThrowError(/MAX_LENGTH_KO/);
  });
});
