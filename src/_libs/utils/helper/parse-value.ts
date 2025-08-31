export function parseBoolean(value: any) {
  if (typeof value === 'string') value = value.toLowerCase();
  switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'y':
    case 'yes':
      return true;
    default:
      return false;
  }
}

export function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export function toBuffer(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}
