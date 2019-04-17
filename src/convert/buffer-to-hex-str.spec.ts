import {bufferToHexStr} from './buffer-to-hex-str';

test('bufferToHexStr', () => {
    expect(bufferToHexStr(Buffer.from('hello'))).toBe('68656c6c6f');
});
