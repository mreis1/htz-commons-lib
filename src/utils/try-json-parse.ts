export function tryJSONParse(data, defaultValue?) {
  try {
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}
