import { IValueProvider } from "../types";

/**
 * This class matches the provided colors to given series.
 * It keeps track of already given colors to given entities to avoid conflicts.
 */
export class MappedValueProvider<T> implements IValueProvider<T> {
    constructor(
        private valueMap: { [key: string]: T },
        private defaultValue?: T
    ) {
        this.reset();
    }

    public get = (entityId: string): T | undefined =>
        this.valueMap[entityId] || this.defaultValue;

    public reset(): void {}
}
