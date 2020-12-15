import { Atom } from "@nova-ui/bits/sdk/atoms";

import { BarDataPointAtom } from "./bar-data-point.atom";
import { SeriesAtom } from "./series.atom";

export class ThresholdSeriesAtom extends SeriesAtom {

    public static buildSeriesId(dataSeriesId: string): string {
        return `${dataSeriesId}__thresholds-background`;
    }

    public getDataPoint(index: number = 0): BarDataPointAtom {
        return Atom.findIn(BarDataPointAtom, this.root, index);
    }

    public async getDataPointCount(): Promise<number> {
        return Atom.findCount(BarDataPointAtom, this.root);
    }
}
