import {ensureValidString} from './ensure-valid-string';

describe('EnsureValidString', () => {
    test('', () => {
        let str = null;
        str = ensureValidString(str, {
            accepts: ['1', '2'],
            defaultValue: '1'
        });
        expect(str).toBe('1');
    });
    test('', () => {
        let str = '1';
        str = ensureValidString(str, {
            accepts: ['1', '2'],
            defaultValue: '1'
        });
        expect(str).toBe('1');
    });
    test('', () => {
        expect(ensureValidString(null, {defaultValue: '0', accepts: ['0', '1']})).toBe('0')
    })
});
