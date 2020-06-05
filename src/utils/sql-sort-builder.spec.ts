import { SqlSortBuilder } from './sql-sort-builder';

describe('', function() {
  describe('Converting', function() {
    let sqlSortBuilder = new SqlSortBuilder({
      acceptedValues: ['A', 'B', 'C']
    });
    it('', function() {
      let r = sqlSortBuilder.convert('a1:ASC,b1:DESC,c1:ASC,d1:DESC,x1:asc', [
        'a1',
        'b1',
        'c1'
      ]);
      sqlSortBuilder.setSort(r);
      expect(sqlSortBuilder.toString({ order: false })).toBe(
        `A ASC,B DESC,C ASC`
      );
      r = sqlSortBuilder.convert('a1:ASC,c1:ASC,d1:DESC,x1:asc,b1:DESC', [
        'a1',
        'b1',
        'c1'
      ]);
      sqlSortBuilder.setSort(r);
      expect(sqlSortBuilder.toString({ order: false })).toBe(`A ASC,C ASC`);
      r = sqlSortBuilder.convert('a1:ASC,c1:ASC,d1:DESC,x1:asc,b1:DESC', [
        'a1',
        'b1',
        'c1'
      ]);
      sqlSortBuilder.setSort(r, { behaviour: 'SKIP_INVALID' });
      expect(sqlSortBuilder.toString({ order: false })).toBe(
        `A ASC,C ASC,B DESC`
      );
    });
  });
  describe('Setting sort', function() {
    let sqlSortBuilder = new SqlSortBuilder({
      acceptedValues: ['A', 'B', 'C']
    });

    it('should parse a string of sorting values: Behaviour KEEP_UNTIL_INVALID', function() {
      sqlSortBuilder.setSort('A:ASC,D:DESC,B:DESC', {
        behaviour: 'KEEP_UNTIL_INVALID'
      });
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC');
    });
    it('should parse a string of sorting values: Behaviour SKIP_INVALID', function() {
      sqlSortBuilder.setSort('A:ASC,D:DESC,B:DESC', {
        behaviour: 'SKIP_INVALID'
      });
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC,B DESC');
    });
    it('should parse a string of sorting values: Behaviour SKIP_INVALID', function() {
      sqlSortBuilder.setSort('A:ASC,D:DESC,B:DESC', {
        behaviour: 'CANCEL_ALL_IF_INVALID_FOUND'
      });
      expect(sqlSortBuilder.toString({ order: false })).toBe('');
    });
    it('should parse a string of sorting values: Default Behaviour (KEEP_UNTIL_INVALID)', function() {
      sqlSortBuilder.setSort('A:ASC,D:DESC,B:DESC', {});
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC');
    });
    it('Array of sorting string values: Default Behaviour (KEEP_UNTIL_INVALID)', function() {
      sqlSortBuilder.setSort(['A:ASC', 'D:DESC', 'B:DESC'], {});
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC');
      sqlSortBuilder.setSort(['A:ASC', 'B:DESC'], {});
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC,B DESC');
    });

    it('should parse a string of sorting values: Default Behaviour (KEEP_UNTIL_INVALID)', function() {
      sqlSortBuilder.setSort(['A:ASC,D:DESC,B:DESC'], {});
      expect(sqlSortBuilder.toString({ order: false })).toBe('A ASC');
    });
  });
});
