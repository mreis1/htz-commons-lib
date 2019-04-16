import {Moment} from 'moment';
import moment = require('moment');
import {isNullOrUndefinedOrEmptyStr} from "../utils/is-null-or-undefined-or-empty-str";

export function ensureValidDate(date:any, defaultValue = void 0, inputFormat = 'YYYY-MM-DD'): Moment{
    if (isNullOrUndefinedOrEmptyStr(date)){
        return defaultValue;
    } else if (date){
        const m = moment(date, inputFormat, null);
        if (m.isValid()){
            return m;
        } else {
            return defaultValue;
        }
    }
}
