export type DeepReadonly<T> = T extends Array<infer AT>
  ? ReadonlyArray<AT>
  : T extends Record<string, unknown>
  ? Readonly<{ [Key in keyof T]: DeepReadonly<T[Key]> }>
  : Readonly<T>;
