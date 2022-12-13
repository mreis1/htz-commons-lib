import { ensureArrayOfNumbers } from './ensure-array-of-numbers';

describe('#ensureArrayOfNumbers', () => {
  test('Multiple scenarios', () => {
    expect(ensureArrayOfNumbers(['1', 2, 3, 'a'])).toHaveLength(3);
    expect(ensureArrayOfNumbers(['1', 2, 3, 'a'])[0]).toBe(1);
    expect(
      ensureArrayOfNumbers(['1.2', '2,3', 3, 'a'], void 0, {
        decimals: true,
      })[0]
    ).toBe(1.2);
    expect(
      ensureArrayOfNumbers(['1.2', '2,3', 3, 'a'], void 0, {
        decimals: true,
      })[1]
    ).toBe(2.3);
    expect(ensureArrayOfNumbers(null)).toBe(void 0);
    expect(ensureArrayOfNumbers(null, [])).toHaveLength(0);
  });

  it('Should respect', () => {

  });

  describe('#general', () => {
    describe('with default configuration', () => {
      it('default must be `decimals: false`', () => {
        // which means discard decimal values
        expect(ensureArrayOfNumbers([1, 2.2, -1])).toHaveLength(1);
      })
    })
  })

  describe('#decimals', () => {
    describe('with default configuration', () => {
      it('Should discard negative', () => {
        const d = ensureArrayOfNumbers([1, '2,2', -1], [], {
          decimals: true,
        });
        expect(d).toHaveLength(2);
        expect(JSON.stringify(d)).toBe(JSON.stringify([1,2.2]));
      })
      it('Should replace comma in numeric strings', () => {
        const d = ensureArrayOfNumbers(['2,23'], [], {
          decimals: true,
        });
        expect(JSON.stringify(d)).toBe(JSON.stringify([2.23]));
      })

      it('Should replace comma in numeric strings', () => {
        const d = ensureArrayOfNumbers(['2,23'], [], {
          decimals: true,
        });
        expect(JSON.stringify(d)).toBe(JSON.stringify([2.23]));
      })
      it('Should discard negative numbers', () => {
        const d = ensureArrayOfNumbers(['-2,23',-1], [], {
          decimals: true,
        });
        expect(d).toHaveLength(0);
      })
    })
  })
});
