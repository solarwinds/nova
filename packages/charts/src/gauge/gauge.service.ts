import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { BandScale } from "../core/common/scales/band-scale";

import { CHART_PALETTE_CS1 } from "../core/common/palette/palettes";
import { IRadialScales } from "../core/common/scales/types";
import { DataAccessor, IAccessors, IChartAssistSeries, IDataSeries } from "../core/common/types";
import { HorizontalBarAccessors } from "../renderers/bar/accessors/horizontal-bar-accessors";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { barScales } from "../renderers/bar/bar-scales";
import { RadialAccessors } from "../renderers/radial/accessors/radial-accessors";
import { radialGaugeRendererConfig } from "../renderers/radial/gauge-renderer-config";
import { RadialGaugeThresholdsRenderer } from "../renderers/radial/radial-gauge-thresholds-renderer";
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

    public assembleLinearSeriesSet(value: number,
                                   max: number,
                                   thresholds: IGaugeThreshold[],
                                   valueColorAccessor?: DataAccessor): IChartAssistSeries<HorizontalBarAccessors>[] {
        const initialValue = value ?? 0;
        const initialMax = max ?? 0;
        const accessors = new HorizontalBarAccessors();
        accessors.data.color = valueColorAccessor || this.createDefaultValueColorAccessor(thresholds);
        const scales = barScales({ horizontal: true });
        const renderer = new BarRenderer();
        renderer.config.padding = 0;
        renderer.config.strokeWidth = 0;
        return [
            ...this.getLinearGaugeData(initialValue, initialMax).map(s => ({
                ...s,
                accessors,
                scales,
                renderer,
            })),
            // this.generateRadialThresholdSeries(initialValue, initialMax, thresholds, accessors, scales),
        ];
    }

    public assembleRadialSeriesSet(value: number,
                                   max: number,
                                   thresholds: IGaugeThreshold[],
                                   valueColorAccessor?: DataAccessor): IChartAssistSeries<RadialAccessors>[] {
        const initialValue = value ?? 0;
        const initialMax = max ?? 0;
        const accessors = new RadialAccessors();
        accessors.data.color = valueColorAccessor || this.createDefaultValueColorAccessor(thresholds);
        const scales = radialScales();
        const renderer = new RadialRenderer(radialGaugeRendererConfig());
        return [
            ...this.getRadialGaugeData(initialValue, initialMax).map(s => ({
                ...s,
                accessors,
                scales,
                renderer,
            })),
            this.generateRadialThresholdSeries(initialValue, initialMax, thresholds, accessors, scales),
        ];
    }

    public generateRadialThresholdSeries(value: number,
                                         max: number,
                                         thresholds: IGaugeThreshold[],
                                         accessors: RadialAccessors,
                                         scales: IRadialScales): IChartAssistSeries<RadialAccessors> {
        return {
            id: GaugeService.THRESHOLD_MARKERS_SERIES_ID,
            data: this.getThresholdMarkerPoints(thresholds, value, max),
            accessors,
            scales,
            renderer: new RadialGaugeThresholdsRenderer(),
            excludeFromArcCalculation: true,
            preprocess: false,
        };
    }

    public updateLinearSeriesSet(value: number,
                                 max: number,
                                 thresholds: IGaugeThreshold[],
                                 seriesSet: IChartAssistSeries<IAccessors>[]): IChartAssistSeries<IAccessors>[] {
        const newValue = value ?? 0;
        const newMax = max ?? 0;
        const updatedSeriesSet = seriesSet.map(series => {
            if (series.id === GaugeService.QUANTITY_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: newValue }] };
            }

            if (series.id === GaugeService.REMAINDER_SERIES_ID) {
                return { ...series, data: [{ category: "gauge", value: newMax - newValue }] };
            }

            // threshold level markers
            return { ...series, data: this.getThresholdMarkerPoints(thresholds, newValue, newMax) };
        });

        return updatedSeriesSet;
    }

    public updateRadialSeriesSet(value: number,
                                 max: number,
                                 thresholds: IGaugeThreshold[],
                                 seriesSet: IChartAssistSeries<IAccessors>[]): IChartAssistSeries<IAccessors>[] {
        const newValue = value ?? 0;
        const newMax = max ?? 0;
        const updatedSeriesSet = seriesSet.map(series => {
            if (series.id === GaugeService.QUANTITY_SERIES_ID) {
                return { ...series, data: [newValue] };
            }

            if (series.id === GaugeService.REMAINDER_SERIES_ID) {
                return { ...series, data: [newMax - newValue] };
            }

            // threshold level markers
            return { ...series, data: this.getThresholdMarkerPoints(thresholds, newValue, newMax) };
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

    private getLinearGaugeData(value: number, max: number) {
        return [
            { id: GaugeService.QUANTITY_SERIES_ID, data: [{ category: "gauge", value }] },
            { id: GaugeService.REMAINDER_SERIES_ID, data: [{ category: "gauge", value: max - value}] },
        ];
    }

    private getRadialGaugeData(value: number, max: number) {
        return [
            { id: GaugeService.QUANTITY_SERIES_ID, data: [value] },
            { id: GaugeService.REMAINDER_SERIES_ID, data: [max - value] },
        ];
    }

    private getThresholdMarkerPoints(thresholds: IGaugeThreshold[], value: number, max: number): IGaugeThresholdMarker[] {
        const markerValues = thresholds.map(threshold => ({
            hit: threshold.value <= value,
            value: threshold.value,
        }));

        return [...markerValues, { value: max }];
    }
}
