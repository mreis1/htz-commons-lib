import { ensureValidDateTime } from './ensure-valid-date-time';

describe('EnsureValidDateTime', () => {
  test('Parser', () => {
    const input = '2022-09-06 13:01:01'
    const o = ensureValidDateTime(input);
    expect(o.format('YYYY-MM-DD HH:mm:ss')).toBe(input);
  });
})
