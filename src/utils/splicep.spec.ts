import {sliceP} from './slicep';

test('sliceP', () => {
    expect(JSON.stringify(sliceP([1, 2, 3, 4],2,2))).toBe(JSON.stringify([3, 4]))
});
