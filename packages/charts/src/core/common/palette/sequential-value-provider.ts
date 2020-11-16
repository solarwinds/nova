import { IValueProvider } from "../types";

/**
 * This class matches the provided instances of type <T> to given series.
 * It keeps track of already given instances to given entities to avoid conflicts.
 */
export class SequentialValueProvider<T> implements IValueProvider<T> {

    private providedValues: { [key: string]: T };
    private lastUsedIndex: number;

    constructor(private values: T[]) {
        this.reset();
    }

    public get = (entityId: string): T => {
        let value = this.providedValues[entityId];
        if (!value) {
            const index = ++this.lastUsedIndex % this.values.length;
            value = this.values[index];
            this.providedValues[entityId] = value;
        }
        return value;
    }

    public reset(): void {
        this.providedValues = {};
        this.lastUsedIndex = -1;
    }
}
