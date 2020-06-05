export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface IOptions {
  initialValue?: string | string[];
  acceptedValues: string[];
}

export type BEHAVIOUR =
  | 'SKIP_INVALID'
  | 'KEEP_UNTIL_INVALID'
  | 'CANCEL_ALL_IF_INVALID_FOUND';

export class SqlSortBuilder {
  public static ensureSortOrder(value: any | SortOrder, defaultValue?) {
    if (SortOrder[value] !== void 0) {
      return value;
    } else {
      return defaultValue;
    }
  }

  public static splitStr(str: string, defaultValue: any) {
    return typeof str === 'string' ? str.split(',') : defaultValue;
  }

  private sortBy: string[];
  private sortByOrder: SortOrder[];
  private acceptedValues: string[];
  private defaultSortOrder: SortOrder = SortOrder.ASC;
  private defaultSetBehaviour: BEHAVIOUR = 'KEEP_UNTIL_INVALID';

  constructor(private options: IOptions) {
    // Needs to be set before setSort() is called
    this.acceptedValues = this.options?.acceptedValues;
    let v = options?.initialValue;
    if (v !== void 0) {
      this.setSort(v);
    }
  }

  /**
   * Given a array of accepted values: ['A', 'B', 'C']
   * if you convert `a1:ASC,b1:DESC,c1:ASC,d1:desc' with a matching table of ['a1','b1','c1']
   * this will return
   * [ ['A','ASC'] , ['B','DESC'], ['C','DESC'], ['d1','DESC'] ]
   *
   * @param str
   * @param arr
   */
  public convert(str: string, arr: string[]) {
    if (!Array.isArray(arr)) {
      throw new Error('Convert expects an array.');
    }
    let props = [];
    SqlSortBuilder.splitStr(str, []).forEach(i => {
      if (typeof i === 'string') {
        let parts = i.split(':');
        let targetI = arr.findIndex(arrV => arrV === parts[0]);
        let convertedValue = this.acceptedValues[targetI];
        if (convertedValue) {
          props.push([convertedValue, parts[1]]);
        } else {
          props.push([parts[0], parts[1]]);
        }
      }
    });
    return props;
  }

  /**
   * Updates the sorting
   *
   *
   * SKIP_INVALID - [valid, invalid, valid] -> outputs: [valid, valid]
   * KEEP_UNTIL_INVALID - [valid, invalid, valid] -> outputs: [valid]
   * CANCEL_ALL_IF_INVALID_FOUND - [valid, invalid, valid] -> outputs: []
   *
   * @param v
   * @param options
   */
  public setSort(
    v: string | string[],
    options?: {
      behaviour?: BEHAVIOUR;
      // if you wish to override the default sort order
      order?: SortOrder;
    }
  ) {
    let behaviour = options?.behaviour || this.defaultSetBehaviour;
    let arr = [];
    let sortBy = [];
    let sortByOrder = [] as SortOrder[];
    if (typeof v === 'string') {
      arr = SqlSortBuilder.splitStr(v, []);
    } else if (Array.isArray(v)) {
      arr = [...v];
    } else {
      arr = [];
    }
    let stop = false;
    while (arr.length && !stop) {
      let prop = arr.shift();
      // tslint:disable-next-line:variable-name
      let _isArray = Array.isArray(prop);
      // tslint:disable-next-line:variable-name
      let _isString = typeof prop === 'string';
      if (_isString || _isArray) {
        let parts = _isArray ? prop : prop.split(':'); // Parse string of format: PROP:ORDER
        const o: string = parts[0];
        let order: SortOrder = SqlSortBuilder.ensureSortOrder(
          parts[1],
          SqlSortBuilder.ensureSortOrder(options?.order, this.defaultSortOrder)
        );
        if (this.isValid(o).valid) {
          sortBy.push(o);
          sortByOrder.push(order);
        } else {
          if (
            behaviour === 'KEEP_UNTIL_INVALID' ||
            behaviour === 'CANCEL_ALL_IF_INVALID_FOUND'
          ) {
            stop = true;
          }
        }
      } else {
        if (
          behaviour === 'KEEP_UNTIL_INVALID' ||
          behaviour === 'CANCEL_ALL_IF_INVALID_FOUND'
        ) {
          stop = true;
        }
      }
    }
    if (behaviour === 'CANCEL_ALL_IF_INVALID_FOUND') {
      sortBy = [];
    }
    this.sortBy = sortBy;
    this.sortByOrder = sortByOrder;
  }

  public toString(options: { order: boolean }) {
    let str = '';
    if (this.sortBy.length) {
      str = this.sortBy.map((v, i) => v + ' ' + this.sortByOrder[i]).join(',');
    }
    if (options?.order && str !== '') {
      str = 'ORDER BY ' + ' ' + str;
    }
    return str;
  }

  private isValid(value): { valid: boolean } {
    let output = { valid: false };
    if (this.acceptedValues.indexOf(value) >= 0) {
      output.valid = true;
    }
    return output;
  }
}
