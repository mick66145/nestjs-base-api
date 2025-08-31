export function assignIf(
  condition: boolean,
  targetObject: object,
  assignObject: Record<string, any>,
  assignInFalse?: Record<string, any>,
) {
  if (condition) {
    Object.assign(targetObject, assignObject);
  } else if (assignInFalse) {
    Object.assign(targetObject, assignInFalse);
  }
}
