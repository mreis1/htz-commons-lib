import {
  EnsureInstanceOptions,
  EnsureOptions,
  Mode,
  Method,
  ensureX,
} from '../ensure/ensure-x';

export interface PropOption<T extends Method> {
  value: any;
  type: T;
  mode: Mode;
  /**
   * @default false
   */
  allowNull?: boolean;
  options?: Omit<
    EnsureOptions<T, false>,
    'errorBuilder' | 'eMode' | 'eField' | 'allowNull' | 'eReturnObject'
  >;
}

export type ModelOption<T> = Record<keyof T, Omit<PropOption<any>, 'value'>>;


export function option<T extends Method>(
  method: T,
  options: Omit<PropOption<T>, 'type' | 'value'>
): PropOption<T> {
  options.options = options.options || {} as any;
  return {
    ...(options as PropOption<T>),
    value: void 0,
    type: method,
  };
}

export interface CheckOptions {
  /**
   * Stops if an error is found in model
   * @default true
   */
  stopOnError: boolean;
  errorBuilder: EnsureInstanceOptions['errorBuilder'];
}

export interface InstanceOptions extends Partial<CheckOptions> {}

export function createInstance(options: InstanceOptions) {
  return function <T extends {}, Y extends ModelOption<T>>(
    model: T,
    data: Y,
    options2?: Partial<CheckOptions>
  ) {
    return checkModel(model, data, {
      ...options,
      ...options2,
    });
  };
}

export function checkModel<T extends {}>(
  model: T,
  data: ModelOption<T>,
  options?: Partial<CheckOptions>
): T {
  let result = {} as any;
  options = options ?? {};
  Object.keys(model).forEach((key) => {
    if (data[key] !== void 0) {
      const o: PropOption<any> = data[key];
      result[key] = ensureX(o.type, model[key], {
        ...o.options,
        eMode: o.mode,
        eField: key,
        allowNull: o.allowNull,
        errorBuilder: options.errorBuilder,
      });
    }
  });
  return result;
}
