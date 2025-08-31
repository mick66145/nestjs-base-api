export function getFileExt(fullName: string): string | null {
  const extRegex = /(?:\.([^.]+))$/;
  const [, fileExt] = extRegex.exec(fullName) ?? [];

  return fileExt !== undefined ? fileExt : null;
}

export function getFilePath(fullPath: string): Array<string> {
  const pathRegex = /([^\/]+)/;

  return pathRegex.exec(fullPath) ?? [];
}
