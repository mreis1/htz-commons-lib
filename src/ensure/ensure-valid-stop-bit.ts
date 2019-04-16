// * @property {number} [stopBits=1] Must be one of these: 1 or 2.
export function ensureValidStopBit(v, defaultValue?) {
    return v === 2 || v === 1 ? v : defaultValue
}