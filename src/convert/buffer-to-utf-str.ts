export function bufferToUtfStr(value) {
    if (Buffer.isBuffer(value)) {
        return value.toString('utf8');
    }
}
