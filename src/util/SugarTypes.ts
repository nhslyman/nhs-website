export type VoidAction = () => void;
export type Optional<T> = T | null | undefined;
export interface Dict<T> {
  [key: string]: T;
}
