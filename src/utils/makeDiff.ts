import format from './format';

export const dirMap = {
  gt: '+',
  lt: '-',
  eq: '',
} as const;

export type TDiffValue = {
  dir: 'gt' | 'lt' | 'eq';
  value: string; // Значние с направлением (на пример: +10.50, -73.23, и.т.д.)
  percent: string; // Процент с направлением (на пример: +3.50%)
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
  const percent = `${dirMap[dir]}${format.percent()(Math.abs(rawPercent))}`;
  const longValue = `${value} (${percent})`;
  const fullValue = `${formatter(currentValue)} / ${longValue}`;

  return {
    dir,
    value,
    percent,
    longValue,
    fullValue,
    raw,
    rawPercent,
    currentValue,
    compareValue,
  };
}
