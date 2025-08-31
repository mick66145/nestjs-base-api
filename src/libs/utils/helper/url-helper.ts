import { PATH_METADATA } from '@nestjs/common/constants';
import { Constructor } from 'src/_libs/utils/interface/common.type';

// lodash
import compact from 'lodash/compact';

export const urlGenerateByController = <T, U extends keyof T>(
  host: string,
  controller: Constructor<T>,
  method: U,
  options?: {
    query?: Record<string, string>;
    pathParams?: Record<string, string>;
  },
) => {
  const controllerPath = <string>Reflect.getMetadata(PATH_METADATA, controller);

  const getMethodPath = () => {
    const methodPath = <string>(
      Reflect.getMetadata(PATH_METADATA, controller['prototype'][method])
    );

    return methodPath === '/' ? '' : methodPath;
  };

  const methodPath = getMethodPath();

  const urlPath = compact([controllerPath, methodPath]).join('/');

  const match = /:[^\/]+/g;
  const matchArray = [...urlPath.matchAll(match)];
  const { query = null, pathParams } = options ?? {};
  let realPath = urlPath;
  const urlSearchParams = new URLSearchParams(query ?? '');
  matchArray.forEach(([matchText]) => {
    const paramName = matchText.replaceAll(/\:/g, '');
    const paramValue =
      pathParams !== undefined ? (pathParams[paramName] ?? null) : null;
    if (paramValue !== null) {
      realPath = realPath.replace(`:${paramName}`, paramValue);
    }
  });

  return [
    `${host}/`,
    realPath,
    query !== null ? `?${urlSearchParams.toString()}` : '',
  ]
    .join('')
    .replace(/([^:]\/)\/+/g, '$1');
};
