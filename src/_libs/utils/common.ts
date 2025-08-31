export function strToEnum<T>(enumT, value: string): T | undefined {
  return (Object.values(enumT) as Array<string>).includes(value)
    ? (value as T)
    : undefined;
}

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export function sum(nums: number[]) {
  return nums.reduce((acc, cur) => acc + cur, 0);
}

export function mean(nums: number[]) {
  return sum(nums) / nums.length;
}

export function std(nums: number[], avg: number) {
  return Math.sqrt(sum(nums.map((n) => (n - avg) ** 2)) / nums.length);
}

export function roundTo(num: number, fractionDigits: number) {
  fractionDigits = parseInt(fractionDigits.toFixed(0));
  const ratio = 10 ** fractionDigits;
  return Math.round(num * ratio) / ratio;
}

export function minutesToMilliSeconds(m: number): number {
  return m * 60 * 1000;
}

export function kmsToMinutesBySpeed(
  kms: number,
  speedInKmsPerHour: number,
  ceil: boolean = false,
): number {
  const result = (kms / speedInKmsPerHour) * 60;
  return ceil ? Math.ceil(result) : result;
}
