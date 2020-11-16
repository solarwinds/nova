import { BandScale } from "../../core/common/scales/band-scale";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { IXYScales } from "../../core/common/scales/types";

import { IBarChartConfig } from "./types";

/**
 * Generates scales definition to be used with category+value based bar charts
 *
 * @param config
 * @param valueScale
 */
export function barScales(config?: IBarChartConfig, valueScale = new LinearScale()): IXYScales {
    const bandScale = new BandScale();
    if (config && config.grouped) {
        bandScale.padding(0.25);
        bandScale.innerScale = new BandScale();
    }
    let scales: IXYScales;
    if (!config || !config.horizontal) {
        scales = {
            x: bandScale,
            y: valueScale,
        };
    } else {
        bandScale.reverse();
        scales = {
            x: valueScale,
            y: bandScale,
        };
    }
    return scales;
}
