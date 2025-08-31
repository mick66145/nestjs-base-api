export type Optional<T> = T | null;
export type Constructor<T = object> = new (...args: any[]) => T;
export type Wrapper<T = object> = { new (): T & any; prototype: T };
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
