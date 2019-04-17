export function bufferToHexStr(value) {
  if (Buffer.isBuffer(value)) {
    return value.toString('hex');
  }
}
