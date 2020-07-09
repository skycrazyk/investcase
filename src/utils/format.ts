const currency = (
  curr: Intl.NumberFormatOptions['currency'] = 'RUB',
  options?: Intl.NumberFormatOptions
) => {
  const format = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  });

  return (value: number) => format.format(value);
};

const number = (options?: Intl.NumberFormatOptions) => {
  const format = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });

  return (value: number) => format.format(value);
};

const percent = (options?: Intl.NumberFormatOptions) => {
  const format = new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return (value: number) => format.format(value / 100);
};

export default {
  currency,
  number,
  percent,
};
