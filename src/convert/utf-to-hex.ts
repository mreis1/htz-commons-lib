export function utfToHex(data: string): string {
  return Buffer.from(data ?? '').toString('hex');
}
