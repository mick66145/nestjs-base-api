import { readFileSync } from 'fs';
import { extname, resolve } from 'path';

export function getFileExt(fullName: string): string | null {
  const extRegex = /(?:\.([^.]+))$/;
  const [, fileExt] = extRegex.exec(fullName) ?? [];

  return fileExt !== undefined ? fileExt : null;
}

export function getFilePath(fullPath: string): Array<string> {
  const pathRegex = /([^\/]+)/;

  return pathRegex.exec(fullPath) ?? [];
}

export function imageToBase64(filePath: string) {
  // 取得完整路徑
  const absolutePath = resolve(filePath);

  // 讀取檔案
  const fileData = readFileSync(absolutePath);

  // 取得副檔名，轉 MIME type
  const ext = extname(filePath).toLowerCase().replace('.', '');
  const mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  // 轉 Base64
  const base64 = fileData.toString('base64');

  // 加上 base64 頭
  return `data:${mime};base64,${base64}`;
}

export function formatFileName(originalname: string) {
  let filename = originalname;
  if (!/[^\u0000-\u00ff]/.test(filename)) {
    filename = Buffer.from(originalname, 'latin1').toString('utf8');
  }

  return filename;
}
