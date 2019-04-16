export function isObject(val) {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
}
