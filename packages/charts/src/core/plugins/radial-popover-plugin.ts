import { ChartPopoverPlugin } from "./chart-popover-plugin";

/**
 * Extends ChartPopoverPlugin to handle popover positioning for radial charts.
 */
export class RadialPopoverPlugin extends ChartPopoverPlugin {
    protected getAbsolutePosition(valArr: any[]) {
        const chartElement: any = this.chart.target?.node()?.parentNode; // the one above svg

        if (!chartElement) {
            throw new Error("Chart parent node is not defined");
        }

        const dataPointsLeft = Math.min(...valArr.map((d) => d.position.x));
        const dataPointsTop = Math.min(...valArr.map((d) => d.position.y));
        const left =
            chartElement.offsetLeft +
            this.chart.getGrid().config().dimension.margin.left +
            dataPointsLeft +
            this.chart.getGrid().config().dimension.width() / 2;
        const top =
            chartElement.offsetTop +
            dataPointsTop +
            this.chart.getGrid().config().dimension.height() / 2;
        return {
            top: top,
            left: left,
            height: 0,
            width: 0,
        };
    }
}
