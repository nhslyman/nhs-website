export type VoidAction = () => void;
export type Optional<T> = T | null;
export interface Dict<T> {
  [key: string]: T;
}
