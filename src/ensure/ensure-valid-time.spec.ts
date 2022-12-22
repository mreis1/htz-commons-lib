import { ensureValidTime } from './ensure-valid-time';

describe('EnsureValidTime', function () {
  it('It should return void if h, min, or seconds are out of range', function () {
    let d;

    d = ensureValidTime(null);
    expect(d).toBe(void 0);

    d = ensureValidTime(void 0);
    expect(d).toBe(void 0);

    d = ensureValidTime('24:00:00');
    expect(d).toBe(void 0);

    d = ensureValidTime('23:59:60');
    expect(d).toBe(void 0);

    d = ensureValidTime('23:60:00');
    expect(d).toBe(void 0);

    d = ensureValidTime('00:00:00');
    expect(d).toStrictEqual({"h": 0, "m": 0, "s": 0, "sTime": 0, "str": "00:00:00"});
    d = ensureValidTime('00:00');
    expect(d).toStrictEqual({"h": 0, "m": 0, "s": 0, "sTime": 0, "str": "00:00:00"});
    d = ensureValidTime('00');
    expect(d).toStrictEqual({"h": 0, "m": 0, "s": 0, "sTime": 0, "str": "00:00:00"});

    d = ensureValidTime('23:50:50');
    expect(d).toStrictEqual({"h": 23, "m": 50, "s": 50, "sTime": 85850, "str": "23:50:50"});

    d = ensureValidTime('23', { defaults: { m: 59, s: 59 } });
    expect(d).toStrictEqual({"h": 23, "m": 59, "s": 59, "sTime": 86399, "str": "23:59:59"});
    expect(d.str).toBe('23:59:59');

    d = ensureValidTime('23');
    expect(d).toStrictEqual({"h": 23, "m": 0, "s": 0, "sTime": 82800, "str": "23:00:00"});

    d = ensureValidTime('23:40', { defaults: { m: 59, s: 59 } });
    expect(d).toStrictEqual({"h": 23, "m": 40, "s": 59, "sTime": 85259, "str": "23:40:59"});
  });
});
