export function defaultEqualityFn<T>(previous: T, current: T): boolean {
  return previous === current;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value?.constructor === Object;
}
