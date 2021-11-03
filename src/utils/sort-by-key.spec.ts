import { sortByKey } from './sort-by-key';

describe('sortByKey', function() {
     it('Sorts Asc', function() {
          const list = [
               { color: 'white', size: 'XXL' },
               { color: 'red', size: 'XL' },
               { color: 'black', size: 'M' }
          ];
          let out = sortByKey(list, 'color', 'ASC');
          expect(out[0].color).toBe('black');
     });
     it('Sorts Desc', function() {
          const list = [
               { color: 'white', size: 'XXL' },
               { color: 'red', size: 'XL' },
               { color: 'black', size: 'M' }
          ];
          let out = sortByKey(list, 'color', 'DESC');
          expect(out[0].color).toBe('white');
     });
     it('Throws on invalid call', function() {
          expect(() => sortByKey({}, 'color', 'DESC')).toThrow();
     });
});
