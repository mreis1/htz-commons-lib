import { bufferToUtfStr } from './buffer-to-utf-str';

test('bufferToUtfStr', () => {
  expect(bufferToUtfStr(Buffer.from('68656c6c6f', 'hex'))).toBe('hello');
});
