/**
 * Takes a Error instance and stringify it's properties
 * @param err
 * @param defaultValue
 */
export function stringifyError(err: Error | any, defaultValue?: any) {
  try {
    let props = Object.getOwnPropertyNames(err);
    let obj = {};
    props.forEach((value, key) => {
      obj[value] = err[value];
    });
    return JSON.stringify(obj);
  } catch (err) {
    return defaultValue;
  }
}
