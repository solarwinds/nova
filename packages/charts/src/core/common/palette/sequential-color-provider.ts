import { SequentialValueProvider } from "./sequential-value-provider";

/**
 * This class matches the provided colors to given series.
 * It keeps track of already given colors to given entities to avoid conflicts.
 */
export class SequentialColorProvider extends SequentialValueProvider<string> {

    constructor(private colors: string[]) {
        super(colors);
    }

}
