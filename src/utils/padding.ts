export function padding(
  value: string,
  numChar: number,
  paddingChar = '0',
  paddingAt: 'right' | 'left' = 'right'
) {
  if (typeof value !== 'string') {
    throw new Error('Value must be a valid string');
  }
  if (typeof paddingChar !== 'string') {
    throw new Error('paddingChar must be a valid string');
  }
  if (!(typeof numChar === 'number' && numChar >= 1)) {
    throw new Error('Invalid `numChar`');
  }

  if (value === void 0 || numChar <= 0) {
    return value;
  }
  if (value.length >= numChar) {
    return value;
  }
  while (value.length < numChar) {
    if (paddingAt === 'right') {
      value = value + paddingChar;
    } else {
      value = paddingChar + value;
    }
  }
  return value;
}

export function paddingLeft(value: string, numChar: number, paddingChar = '0') {
  return padding(value, numChar, paddingChar, 'left');
}
export function paddingRight(
  value: string,
  numChar: number,
  paddingChar = '0'
) {
  return padding(value, numChar, paddingChar, 'right');
}
