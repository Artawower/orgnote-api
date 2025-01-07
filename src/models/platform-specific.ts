// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlatformSpecificFn = <T extends (...params: any[]) => any>(
  fn?: T,
  defaultValue?: ReturnType<T> | Promise<ReturnType<T>>
) => (...params: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>>;
