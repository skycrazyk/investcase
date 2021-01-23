export const exchangeCurrencies = {
  usd: 'usd',
  eur: 'eur',
} as const;

export const productCurrencies = {
  rub: 'rub',
  ...exchangeCurrencies,
} as const;

export type TProduct = {
  id: string;
  count: number;
  liquidationPrice: number;
  balancePrice: number;
  payments: number;
};

export type TRate = {
  [key in keyof typeof exchangeCurrencies]: number;
};

export type TReport = {
  id: string;
  date: string;
  products: TProduct[];
  rate: TRate;
};
