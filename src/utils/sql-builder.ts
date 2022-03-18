enum Type {
  QUERY,
  GROUP,
}

enum Operation {
  AND,
  OR,
}

export interface ISqlBuilderCondition {
  type: Type;
  operation: Operation;
  value?: any;
  builder?: SqlBuilder;
}

export class SqlBuilder {
  private conditions: ISqlBuilderCondition[] = [];

  public orGroup() {
    let b = new SqlBuilder();
    this.conditions.push({
      type: Type.GROUP,
      operation: Operation.OR,
      builder: b,
    });
    return b;
  }

  public andGroup() {
    let b = new SqlBuilder();
    this.conditions.push({
      type: Type.GROUP,
      operation: Operation.AND,
      builder: b,
    });
    return b;
  }

  public and(value: string) {
    if (typeof value === 'string') {
      value = value.trim();
      if (value.length >= 1) {
        this.conditions.push({
          type: Type.QUERY,
          operation: Operation.AND,
          value,
        });
      }
    }
    return this;
  }
  public or(value: string) {
    if (typeof value === 'string') {
      value = value.trim();
      if (value.length >= 1) {
        this.conditions.push({
          type: Type.QUERY,
          operation: Operation.OR,
          value,
        });
      }
    }
    return this;
  }

  public toString(options: { where: boolean }) {
    let strArr = [];
    let str = '';
    this.conditions.forEach((condition) => {
      let operator = condition.operation === Operation.AND ? 'AND' : 'OR';
      if (condition.type === Type.GROUP) {
        let v = condition.builder.toString({ where: false });
        if (v) {
          strArr.push([operator, '(' + v + ')']);
        }
      } else if (condition.type === Type.QUERY) {
        strArr.push([operator, condition.value]);
      }
    });

    if (strArr[0]) {
      strArr[0].shift();
    }

    strArr.forEach((item) => {
      let part = ` ${item.join(' ')}`;
      str += part;
    });

    if (options && options.where && str) {
      str = ' WHERE ' + str + ' ';
    }

    return str;
  }
}
