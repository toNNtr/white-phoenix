export type InferArrayItem<T extends Array<unknown>> = T extends Array<infer I> ? I : never;
export type GetParameters<T> = T extends (...args: infer P) => unknown ? P : never;
export type ValueOf<T> = T[keyof T];
export type OptionalArray<T extends unknown[]> =
    T extends Array<infer I> ? (I extends unknown ? [] : Array<I>) : [];
