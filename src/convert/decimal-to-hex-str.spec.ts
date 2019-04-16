import {decimalToHexStr} from './decimal-to-hex-str';

describe('decimalToHexStr', () => {
    test('it should convert', () => expect(decimalToHexStr(255)).toBe('ff'));
    test('it should convert', () => expect(decimalToHexStr(911)).toBe('038f'));
});

