export type Optional<T> = T | null;
export type Constructor<T = object> = new (...args: any[]) => T;
export type Wrapper<T = object> = { new (): T & any; prototype: T };
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type NonNullableAllProperty<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type NonNullableProperty<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

export type PartialKey<T, K extends keyof T> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

export type RequiredKey<T extends object, K extends keyof T> = Required<
  Pick<T, K>
> &
  Omit<T, K>;
