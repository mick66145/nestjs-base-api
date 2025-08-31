import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export function abort(
  message: string,
  code?: HttpStatus,
  otherData?: Record<string, any>,
  options?: HttpExceptionOptions,
): never {
  throw new HttpException(
    Object.assign({ message }, otherData ?? {}),
    code ?? HttpStatus.BAD_REQUEST,
    options,
  );
}

export function abortIf(
  condition: boolean,
  message: string,
  code?: HttpStatus,
  otherData?: Record<string, any>,
  options?: HttpExceptionOptions,
) {
  if (condition) {
    throw new HttpException(
      Object.assign({ message }, otherData ?? {}),
      code ?? HttpStatus.BAD_REQUEST,
      options,
    );
  }
}
