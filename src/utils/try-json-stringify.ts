export function tryJSONStringify(data, defaultValue?) {
  try {
    return JSON.stringify(data);
  } catch (err) {
    return defaultValue;
  }
}
