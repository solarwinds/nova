import { SimpleChange, SimpleChanges } from "@angular/core";
/**
 *
 * Same as Partial<T> but goes deeper and makes all of its properties and sub-properties Partial<T>.
 */
export type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export interface ComponentChange<T, P extends keyof T> extends SimpleChange {
    previousValue: T[P];
    currentValue: T[P];
}

export type ComponentChanges<T> = {
    [P in keyof T]?: ComponentChange<T, P>;
} & SimpleChanges;
