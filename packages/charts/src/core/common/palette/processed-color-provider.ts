import { IValueProvider } from "../types";

/**
 * This color provider processes values provided by the source provider using the given function.
 * Examples would be darken, lighten, reduce opacity, etc.
 */
export class ProcessedColorProvider implements IValueProvider<string> {
    private processedColors: { [key: string]: string };

    constructor(
        private sourceProvider: IValueProvider<string>,
        private fn: (input: string) => string
    ) {
        this.reset();
    }

    public get = (entityId: string): string => {
        const clr = this.sourceProvider.get(entityId);

        if (!clr) {
            throw new Error("clr is not defined");
        }

        let processedColor = this.processedColors[clr];
        if (!processedColor) {
            processedColor = this.fn(clr);
            this.processedColors[clr] = processedColor;
        }
        return processedColor;
    };

    public reset(): void {
        this.processedColors = {};
    }
}
