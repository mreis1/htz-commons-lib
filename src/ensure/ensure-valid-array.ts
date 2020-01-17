export function ensureValidArray(value: any, defaultValue?: any) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return defaultValue;
  }
}
