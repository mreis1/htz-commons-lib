export function decimalToHexStr(d) {
    let hex = (d).toString(16);
    while (hex.length % 2 !== 0) {
        hex = '0' + hex
    }
    return hex;
}
