import { Transform } from 'class-transformer';

export function TransformToNumberArray() {
  return Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value === undefined
        ? []
        : [Number(value)],
  );
}
