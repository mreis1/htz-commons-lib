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
  /**
   * @default strict_if_provided
   */
  mode?: Mode;
  /**
   * @default false
   */
  allowNull?: boolean;
  /**
   * Careful: This property shall not be provided unless you want the provided value to
   * be used once a null is presented as a input value.
   *
   * `void 0 aka undefined` are considered to be valid values for nullTo.
   *
   * So simply omit the property.
   */
  nullTo?: any;
  options?: Omit<
    EnsureOptions<T, false>,
    'errorBuilder' | 'eMode' | 'eField' | 'allowNull' | 'eReturnObject'
  >;
}

export type ModelOption<T> = Record<keyof T, Omit<PropOption<any>, 'value'>>;

export function option<T extends Method>(
  method: T,
  options?: Omit<PropOption<T>, 'type' | 'value'>
): PropOption<T> {
  options ??= ({} as any);
  options.options = options.options || ({} as any);
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

export interface InstanceOptions<T extends boolean>
  extends Partial<CheckOptions> {
  /**
   * @default: false
   */
  async?: T;
}
export type InstanceOutput<
  T extends boolean,
  Y extends {} = any
> = T extends true ? Promise<Y> : Y;

export function createInstance<Z extends boolean = false>(
  options: InstanceOptions<Z>
) {
  let async = options.async;
  options.async = void 0;
  return function <T extends {}, Y extends ModelOption<T>>(
    model: T,
    data: Y,
    options2?: Partial<CheckOptions>
  ): InstanceOutput<Z, T> {
    if (async) {
      return <any>new Promise((resolve, reject) => {
        try {
          const o = checkModel(model, data, {
            ...options,
            ...options2,
          });
          resolve(o);
        } catch (err) {
          reject(err);
        }
      });
    } else {
      return <any>checkModel(model, data, {
        ...options,
        ...options2,
      });
    }
  };
}

export function checkModel<T extends {}>(
  model: T,
  modelDef: ModelOption<T>,
  options?: Partial<CheckOptions>
): T {
  let result = {} as any;
  options = options ?? {};
  Object.keys(modelDef).forEach((key) => {
    if (modelDef[key] !== void 0) {
      const o: PropOption<any> = modelDef[key];
      let opts = {
        ...o.options,
        eMode: o.mode ?? 'strict_if_provided',
        eField: key,
        allowNull: o.allowNull,
        errorBuilder: options.errorBuilder,
      };
      if ('nullTo' in o) {
        opts.nullTo = o.nullTo;
      }
      result[key] = ensureX(o.type, model[key], opts);
    }
  });
  return result;
}
