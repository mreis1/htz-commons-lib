import { tryJSONParse } from './try-json-parse';

describe('tryJSONParse', () => {
  it('null should be preserved', () => {
    expect(tryJSONParse(null)).toBe(null);
  });

  it('numeric strings should be parsed', () => {
    expect(tryJSONParse('1.232e3')).toBe(1232);
    expect(tryJSONParse('1.23')).toBe(1.23);
    expect(tryJSONParse('1.23')).toBe(1.23);
  });

  it('JSON object', () => {
    const o = tryJSONParse('{"a":"b"}');
    expect(o).toHaveProperty('a');
    expect(o.a).toBe('b');
    const oInvalid = tryJSONParse('{a":"b"}');
    expect(oInvalid).toBe(void 0);
    const oInvalid2 = tryJSONParse('{a":"b"}', 2);
    expect(oInvalid2).toBe(2);
  });
});
