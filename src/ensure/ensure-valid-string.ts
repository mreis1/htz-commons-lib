import {isObject} from '../utils/is-object';
import {ensureValidNumber} from "./ensure-valid-number";

interface IEnsureValidStringOpts {
    defaultValue?: any;
    minLength?: number;
    accepts?: string[];
    rejects?: string[];
    // Either we should or not transform the string before comparing it with the accepted values
    transform?: ('none' | 'upperCase' | 'lowerCase')
}

export function ensureValidString(str: string, options?: IEnsureValidStringOpts)
export function ensureValidString(str: string, defaultValue?: string)
export function ensureValidString(str: string, defaultValueOrOptions?: any) {
    let defaultValue;
    let minLength;
    let options: IEnsureValidStringOpts;
    options = isObject(defaultValueOrOptions) ? defaultValueOrOptions : null;
    if (options) {
        minLength = ensureValidNumber(options.minLength, 1);
        defaultValue = options.defaultValue;
    } else {
        minLength = 1;
        defaultValue = defaultValueOrOptions;
    }
    if (typeof str === 'string' && str.length >= minLength) {
        if (options) {
            if (options.transform) {
                if (options.transform === "lowerCase") {
                    str = str.toLowerCase();
                } else if (options.transform === "upperCase") {
                    str = str.toUpperCase();
                } else {
                    str = str.toLowerCase();
                }
            }
            if (options.accepts) {
                if (options.accepts.indexOf(str) >= 0) {
                    return str;
                } else {
                    return defaultValue;
                }
            }
        }
        return str;
    } else {
        return defaultValue;
    }
}
