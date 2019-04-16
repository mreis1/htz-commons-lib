export function decimalToHexStr(d) {
    let hex = (d).toString(16);
    while (hex.length % 2 !== 0) {
        console.log('=>' + hex);
        hex = '0' + hex
    }
    console.log(hex);
    return hex;
}
