import { ValidationOptions, ValidateIf } from 'class-validator';

export function Sometimes(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => value !== undefined, validationOptions);
}
