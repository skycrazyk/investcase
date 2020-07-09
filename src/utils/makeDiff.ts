import format from './format';

export const dirMap = {
  gt: '+',
  lt: '-',
  eq: '',
} as const;

export type TDiffValue = {
  dir: 'gt' | 'lt' | 'eq';
  value: string; // Значние с направлением (на пример: +52.25, -73.23, и.т.д.)
  longValue: string; // value + процентом (на пример: +10.50 (+3.50%))
  fullValue: string; // currentValue + longValue
  raw: number; // Оригинальное значение
  rawPercent: number;
  currentValue: number; // Текущее значение
  compareValue: number; // Значение с которым сравниваем
};

export default function makeDiff(
  currentValue: number,
  compareValue: number,
  formatter: (value: number) => string | undefined = format.number()
): TDiffValue {
  const raw = currentValue - compareValue;
  const dir = raw > 0 ? 'gt' : raw < 0 ? 'lt' : 'eq';
  const value = `${dirMap[dir]}${formatter(Math.abs(raw))}`;
  const onePercent = currentValue / 100;
  const rawPercent = raw / onePercent;
  const longValue = `${value} (${dirMap[dir]}${format.percent()(
    Math.abs(rawPercent)
  )})`;
  const fullValue = `${formatter(currentValue)} / ${longValue}`;

  return {
    dir,
    value,
    longValue,
    fullValue,
    raw,
    rawPercent,
    currentValue,
    compareValue,
  };
}
