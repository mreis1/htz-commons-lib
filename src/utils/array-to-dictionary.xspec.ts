import { arrayToDictionaryBy } from './array-to-dictionary';

describe('arrayToDictionaryBy', function() {
  test('should export the latest element with id 1', () => {
    const o = arrayToDictionaryBy([{id: 'x1', name: 'x'}, {id: 'x1', name: 'bar'}], 'id');
    expect(o.x1).toStrictEqual({id: 'x1', name: 'bar'});
  })
  test('should export the latest element with id 1', () => {
    const o = arrayToDictionaryBy([{id: 'x2', name: 'x'}, {id: 'x2', name: 'bar'}], 'id', true);
    expect(o.x2).toHaveLength(2);
    expect(o.x2[1]).toStrictEqual({id: 'x2', name: 'bar'});
  })
});
