export function utfToBuffer(value) {
  if (typeof value === 'string') {
    return Buffer.from(value, 'utf8');
  }
}
