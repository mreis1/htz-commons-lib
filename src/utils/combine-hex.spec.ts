import { combineHex } from './combine-hex';

test('combineHex', () => {
  expect(
    combineHex(
      Buffer.from('hello'), // Here we use a buffer
      [0xff], // Here we use an array containing hex values
      0x10,
      255,
      Buffer.from('test')
    ).toString('hex')
  ).toBe('68656c6c6fff10ff74657374');
  expect(
    combineHex(
      [0xff],
    ).toString('hex')
  ).toBe('ff');

  expect(
    combineHex(
      0xff,
    ).toString('hex')
  ).toBe('ff');

  expect(() =>
    combineHex(
      'hello', // Here we use a buffer
      Buffer.from('test')
    ).toString('hex')
  ).toThrow('Invalid input value');

  expect(combineHex().toString('hex')).toBe('');
});
