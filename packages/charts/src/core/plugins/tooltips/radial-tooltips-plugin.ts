import { ConnectedPosition } from "@angular/cdk/overlay";
import { DefaultArcObject } from "d3-shape";

import { RadialRenderer } from "../../../renderers/radial/radial-renderer";
import { IAccessors, IChartSeries, IDataPoint, IPosition } from "../../common/types";

import { ChartTooltipsPlugin, ITooltipPosition } from "./chart-tooltips-plugin";

/**
 * The circle is divided into 8 parts (E, SE, S, SW, ...), these values represent the connection points
 * on the source element for the tooltip position starting with EAST and going clockwise)
 */
const CONNECTION_POINTS: { x: "start" | "center" | "end", y: "top" | "center" | "bottom" }[] =
    [
        {x: "end", y: "center"},
        {x: "end", y: "bottom"},
        {x: "center", y: "bottom"},
        {x: "start", y: "bottom"},
        {x: "start", y: "center"},
        {x: "start", y: "top"},
        {x: "center", y: "top"},
        {x: "end", y: "top"},
    ];

/** This conversion map is used to calculate the opposite connection points for the tooltip element */
const OPPOSITE: { [key: string]: string } = {
    "start": "end",
    "end": "start",
    "top": "bottom",
    "bottom": "top",
};

/**
 * This radial tooltips plugin handles special tooltip positioning requirements for donut / pie charts.
 */
export class RadialTooltipsPlugin extends ChartTooltipsPlugin {

    protected getTooltipPosition(dataPoint: IDataPoint, chartSeries: IChartSeries<IAccessors>): ITooltipPosition {
        const pieArcData: DefaultArcObject = dataPoint.data;
        const renderer = <RadialRenderer>chartSeries.renderer;
        const rScale = chartSeries.scales.r;
        // this calculation was taken from the radial renderer implementation
        const outerRadius = renderer.getOuterRadius(rScale.range(), dataPoint.index);

        const r = outerRadius + this.tooltipPositionOffset;
        // pie charts start on the top, so we need to subtract Math.PI / 2
        const a = (pieArcData.startAngle + pieArcData.endAngle) / 2 - Math.PI / 2;

        return {
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            width: 0,
            height: 0,
            overlayPositions: [this.getOverlayPosition(a)],
        };
    }

    protected getAbsolutePosition(relativePosition: ITooltipPosition, chartPosition: IPosition): ITooltipPosition {
        const absolutePosition = super.getAbsolutePosition(relativePosition, chartPosition);

        // radial grid is shifted so that the origin is located in the middle of the rendering area,
        // so we need to add it back when we're emitting absolute positions for the tooltips
        absolutePosition.x += this.chart.getGrid().config().dimension.width() / 2;
        absolutePosition.y += this.chart.getGrid().config().dimension.height() / 2;

        return absolutePosition;
    }

    /**
     * Calculate the position for the tooltip overlay based on the angle of the pie slice
     *
     * @param {number} angle in radians
     */
    private getOverlayPosition(angle: number): ConnectedPosition {
        const sectionIndex = this.getSectionIndex(angle, 8);

        return {
            originX: CONNECTION_POINTS[sectionIndex].x,
            originY: CONNECTION_POINTS[sectionIndex].y,
            overlayX: this.opposite(CONNECTION_POINTS[sectionIndex].x),
            overlayY: this.opposite(CONNECTION_POINTS[sectionIndex].y),
        };
    }

    /**
     * Calculates what section of the circle does the given angle belong to
     *
     * @param {number} angle in radians
     * @param {number} sections The number of sections the circle is divided into
     */
    private getSectionIndex(angle: number, sections: number) {
        let sectionIndex = Math.round(angle / (Math.PI * 2 / sections)) % sections;
        while (sectionIndex < 0) {
            sectionIndex += sections;
        }
        return sectionIndex;
    }

    private opposite(direction: string): any {
        return OPPOSITE[direction] || direction;
    }

}
