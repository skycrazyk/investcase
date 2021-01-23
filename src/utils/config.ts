type TConfig = {
  undoLimit: number;
};

const config: TConfig = {
  undoLimit: 10,
} as const;

export default config;
