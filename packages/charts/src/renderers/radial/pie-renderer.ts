import { Arc, DefaultArcObject } from "d3-shape";

import { RadialRenderer } from "./radial-renderer";

/**
 * Renderer that is able to draw pie chart
 */
export class PieRenderer extends RadialRenderer {
    protected getArc(
        range: [number, number],
        arc: Arc<any, DefaultArcObject>,
        index: number
    ) {
        return arc.outerRadius(range[1] - range[0]).innerRadius(0);
    }
}
