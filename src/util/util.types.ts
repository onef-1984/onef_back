export type UtilFnPick = <
  T extends Record<string, any>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => Pick<T, K[number]>;
export type UtilFnOmit = <
  T extends Record<string, any>,
  K extends Array<keyof T>,
>(
  obj: T,
  keys: K,
) => Omit<T, K[number]>;
