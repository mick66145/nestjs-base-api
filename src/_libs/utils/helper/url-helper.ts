export const urlGenerate = (
  host: string,
  path: string,
  options?: {
    query?: Record<string, string>;
    pathParams?: Record<string, string>;
  },
) => {
  const match = /\{[^{}]*\}/g;
  const matchArray = [...path.matchAll(match)];
  const { query = null, pathParams } = options ?? {};
  let realPath = path;
  const urlSearchParams = new URLSearchParams(query ?? '');

  matchArray.forEach(([matchText]) => {
    const paramName = matchText.replaceAll(/\{|\}/g, '');
    const paramValue =
      pathParams !== undefined ? (pathParams[paramName] ?? null) : null;
    if (paramValue !== null) {
      realPath = realPath.replace(`{${paramName}}`, paramValue);
    }
  });

  return [
    `${host}/`,
    realPath,
    query !== null ? `?${urlSearchParams.toString()}` : '',
  ].join('');
};
