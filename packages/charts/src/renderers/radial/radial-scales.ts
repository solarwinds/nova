import { LinearScale } from "../../core/common/scales/linear-scale";
import {
    IRadialScales,
    NORMALIZED_DOMAIN,
} from "../../core/common/scales/types";

/**
 * Generates scales definition to be used with radial charts
 */
export function radialScales(): IRadialScales {
    return {
        r: new LinearScale().fixDomain(NORMALIZED_DOMAIN),
    };
}
