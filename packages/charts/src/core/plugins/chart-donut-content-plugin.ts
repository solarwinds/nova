import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { RadialRenderer } from "../../renderers/radial/radial-renderer";
import { ChartPlugin } from "../common/chart-plugin";

import { IElementPosition } from "./types";

/**
* This plugin calculates new size and position for content inside donut chart
*/
export class ChartDonutContentPlugin extends ChartPlugin {
    /** Subject for getting updates on the content position */
    public contentPositionUpdateSubject = new Subject<IElementPosition>();

    /** The current content position */
    public contentPosition: IElementPosition = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    };

    public updateDimensions() {
        const radius = this.chart.getDataManager().chartSeriesSet.reduce((prev: number | undefined, current) => {
            if (current.renderer instanceof RadialRenderer && !isUndefined(prev)) {
                return Math.min(prev, current.renderer.getInnerRadius(current.scales.r.range(), current.data.length - 1));
            }
            return prev;
        }, Infinity);

        if (isUndefined(radius)) {
            throw new Error("Radius is undefined");
        }

        this.contentPosition = this.getContentPosition(radius);
        this.contentPositionUpdateSubject.next(this.contentPosition);
    }

    public destroy(): void {
        this.contentPositionUpdateSubject.complete();
    }

    private getContentPosition(areaSize: number): IElementPosition {
        const basics = [this.chart.getGrid().config().dimension.outerWidth() / 2, this.chart.getGrid().config().dimension.outerWidth() / 2];
        return {
            top: basics[1] - (areaSize / Math.sqrt(2)),
            left: basics[0] - (areaSize / Math.sqrt(2)),
            width: areaSize * Math.sqrt(2),
            height: areaSize * Math.sqrt(2),
        };
    }
}
