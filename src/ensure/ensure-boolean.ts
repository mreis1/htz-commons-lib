import { tryJSONParse } from "../utils/try-json-parse";

export function ensureBoolean(data, defaultValue?) {
  return typeof data === "boolean" ? data : tryJSONParse(data, defaultValue);
}
