/**
 * Allows to access a property from a string literal path.
 * Example:
 *   var a = { "users": [{ "name": "Jessica"}] }
 *   ObjectByString(a, 'users.name')
 * Source:
 * https://stackoverflow.com/a/6491621/1084568
 *
 * @param o         The object to process
 * @param s         The string literal path
 * @param opt
 * @constructor
 */
export function objectByString(
     o,
     s: string,
     opt?: {
          /**
           * § handleIndexes
           * When true, we can provide options such as
           *   user[0].name
           */
          handleIndexes: boolean;
     }
) {
     if (opt?.handleIndexes) {
          s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
     }
     /**
      * In order to reduce the number of regexp
      * I replaced this line:
      *        s = s.replace(/^\./, '');
      * By a simple if that checks if the first value is ''
      */
     let a = s.split('.');
     if (a[0] === '') {
          a.shift();
     }
     for (let i = 0, n = a.length; i < n; ++i) {
          let k = a[i];
          if (k in o) {
               o = o[k];
          } else {
               return;
          }
     }
     return o;
}
