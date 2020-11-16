import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";

import { CHART_PALETTE_CS1 } from "../core/common/palette/palettes";
import { DataAccessor, IAccessors, IChartAssistSeries, IDataSeries } from "../core/common/types";
import { IRadialScales } from "../core/public-api";
import { RadialAccessors } from "../renderers/radial/accessors/radial-accessors";
import { gaugeRendererConfig } from "../renderers/radial/gauge-renderer-config";
import { GaugeThresholdsRenderer } from "../renderers/radial/gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";
import { radialScales } from "../renderers/radial/radial-scales";

import { IGaugeThreshold, IGaugeThresholdMarker } from "./types";

@Injectable({
    providedIn: "root",
})
export class GaugeService {
    public static QUANTITY_SERIES_ID = "quantity";
    public static REMAINDER_SERIES_ID = "remainder";
    public static THRESHOLD_MARKERS_SERIES_ID = "threshold-markers";

    public assembleRadialSeriesSet(value: number,
                                   max: number,
                                   thresholds: IGaugeThreshold[],
                                   valueColorAccessor?: DataAccessor): IChartAssistSeries<RadialAccessors>[] {
        const accessors = new RadialAccessors();
        accessors.data.color = valueColorAccessor || this.createDefaultValueColorAccessor(thresholds);
        const scales = radialScales();
        const renderer = new RadialRenderer(gaugeRendererConfig());
        return [
            ...this.getGaugeData(value, max).map(s => ({
                ...s,
                accessors,
                scales,
                renderer,
            })),
            this.generateThresholdSeries(value, max, thresholds, accessors, scales),
        ];
    }

    public generateThresholdSeries(value: number,
                                   max: number,
                                   thresholds: IGaugeThreshold[],
                                   accessors: RadialAccessors,
                                   scales: IRadialScales): IChartAssistSeries<RadialAccessors> {
        return {
            id: GaugeService.THRESHOLD_MARKERS_SERIES_ID,
            data: this.getThresholdMarkerPoints(thresholds, value, max),
            accessors,
            scales,
            renderer: new GaugeThresholdsRenderer(),
            excludeFromArcCalculation: true,
            preprocess: false,
        };
    }

    public updateRadialSeriesSet(value: number,
                                 max: number,
                                 thresholds: IGaugeThreshold[],
                                 seriesSet: IChartAssistSeries<RadialAccessors>[]): IChartAssistSeries<RadialAccessors>[] {
        const updatedSeriesSet = seriesSet.map(series => {
            if (series.id === GaugeService.QUANTITY_SERIES_ID) {
                return { ...series, data: [value] };
            }

            if (series.id === GaugeService.REMAINDER_SERIES_ID) {
                return { ...series, data: [max - value] };
            }

            // threshold level markers
            return { ...series, data: this.getThresholdMarkerPoints(thresholds, value, max) };
        });

        return updatedSeriesSet;
    }

    private createDefaultValueColorAccessor(thresholds: IGaugeThreshold[]) {
        return (quantity: number, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GaugeService.REMAINDER_SERIES_ID) {
                return "var(--nui-color-semantic-unknown-bg-hover)";
            } else {
                if (!isUndefined(thresholds[1].value) && thresholds[1].value <= quantity) {
                    return "var(--nui-color-semantic-critical)";
                }
                if (!isUndefined(thresholds[0].value) && thresholds[0].value <= quantity) {
                    return "var(--nui-color-semantic-warning)";
                }
                return CHART_PALETTE_CS1[0];
            }
        };
    }

    private getGaugeData(value: number, max: number) {
        return [
            { id: GaugeService.QUANTITY_SERIES_ID, data: [value] },
            { id: GaugeService.REMAINDER_SERIES_ID, data: [max - value] },
        ];
    }

    private getThresholdMarkerPoints(thresholds: IGaugeThreshold[], value: number, max: number): IGaugeThresholdMarker[] {
        const markerValues =  thresholds.map(threshold => ({
            hit: threshold.value <= value,
            value: threshold.value,
        }));

        return [...markerValues, { value: max }];
    }
}
