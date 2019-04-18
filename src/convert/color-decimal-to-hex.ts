export function colorDecimalToHex(color: number) {
    let hex = (color).toString(16);
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return hex;
}
