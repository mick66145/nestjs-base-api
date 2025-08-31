import { Transform, TransformOptions } from 'class-transformer';

const transform = (
  transformFn: (value: any) => boolean,
  toValue: any,
  options?: TransformOptions,
) => {
  const toPlain = Transform(
    ({ value }) => {
      return transformFn(value) ? toValue : value;
    },
    { ...options, toPlainOnly: true },
  );

  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj, value }) => {
        return transformFn(obj[key]) ? toValue : value;
      },
      { ...options, toClassOnly: true },
    )(target, key);
  };

  const run = (target: any, key: string) => {
    const nonSetToOnly =
      options?.toClassOnly === undefined && options?.toPlainOnly === undefined;

    if (nonSetToOnly || options.toClassOnly) {
      toClass(target, key);
    }

    if (nonSetToOnly || options.toPlainOnly) {
      toPlain(target, key);
    }
  };

  return { toPlain, toClass, run };
};

export const TransformFalsyToNull = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => (value || null) === null,
      null,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformFalsyToUndefined = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => (value || null) === null,
      undefined,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformFalsyTo = (toValue: any, options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => (value || null) === null,
      toValue,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformEmptyStringToNull = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform((value) => value === '', null, options);

    transformObj.run(target, key);
  };

export const TransformEmptyStringToUndefined = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform((value) => value === '', undefined, options);

    transformObj.run(target, key);
  };

export const TransformEmptyStringTo = (
  toValue: any,
  options?: TransformOptions,
) =>
  function (target: any, key: string) {
    const transformObj = transform((value) => value === '', toValue, options);

    transformObj.run(target, key);
  };

export const TransformNullToUndefined = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => value === null,
      undefined,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformNullTo = (toValue: any, options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform((value) => value === null, toValue, options);

    transformObj.run(target, key);
  };

export const TransformUndefinedToNull = (options?: TransformOptions) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => value === undefined,
      null,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformUndefinedTo = (
  toValue: any,
  options?: TransformOptions,
) =>
  function (target: any, key: string) {
    const transformObj = transform(
      (value) => value === undefined,
      toValue,
      options,
    );

    transformObj.run(target, key);
  };

export const TransformIfToNull = (
  transformFn: (value: any) => boolean,
  options?: TransformOptions,
) =>
  function (target: any, key: string) {
    const transformObj = transform(transformFn, null, options);

    transformObj.run(target, key);
  };

export const TransformIfToUndefined = (
  transformFn: (value: any) => boolean,
  options?: TransformOptions,
) =>
  function (target: any, key: string) {
    const transformObj = transform(transformFn, undefined, options);

    transformObj.run(target, key);
  };

export const TransformIfTo = (
  transformFn: (value: any) => boolean,
  toValue: any,
  options?: TransformOptions,
) =>
  function (target: any, key: string) {
    const transformObj = transform(transformFn, toValue, options);

    transformObj.run(target, key);
  };
