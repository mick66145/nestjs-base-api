import { ValidationError, validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export function dtoInstanceCheckSync<T extends object, E extends Error>(
  instance: T,
  errorClass: ClassConstructor<E>,
) {
  const errors = validateSync(instance);
  if (errors.length > 0) {
    const errorMessage = asErrorMessageList(errors).join(', ');
    const message = `${instance.constructor.name} validation errors: ${errorMessage}`;
    throw new errorClass(message);
  }
}

export function asErrorMessageList(validationErrors: ValidationError[]) {
  return validationErrors
    .flatMap((error) => mapChildrenToValidationErrors(error))
    .filter((item) => !!item.constraints)
    .flatMap((item) => Object.values(item.constraints ?? {}));
}

function mapChildrenToValidationErrors(
  error: ValidationError,
  parentPath?: string,
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors: ValidationError[] = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
}

function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError,
): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return { ...error, constraints };
}
