export type ToIntersection<Array extends unknown[], Union = Array[number]> = (
  Union extends any ? (arg: Union) => void : never
) extends (arg: infer Intersection) => void
  ? Intersection
  : never;
