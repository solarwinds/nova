import { IChartMarker } from "../types";

import { SequentialValueProvider } from "./sequential-value-provider";

/**
 * This class matches the provided markers to given series.
 * It keeps track of already given markers to given entities to avoid conflicts.
 */
export class SequentialChartMarkerProvider extends SequentialValueProvider<IChartMarker> {
    constructor(private markers: IChartMarker[]) {
        super(markers);
    }
}
