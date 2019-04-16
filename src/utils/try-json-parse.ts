export function tryJSONParse(data, defaultValue = undefined){
    try {
        return JSON.parse(data);
    } catch (err){
        return defaultValue;
    }

}