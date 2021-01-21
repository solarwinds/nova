import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";

import { CHART_PALETTE_CS1 } from "../core/common/palette/palettes";
import { Renderer } from "../core/common/renderer";
import { IRadialScales, Scales } from "../core/common/scales/types";
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

export enum GaugeMode {
    Radial = "radial",
    Horizontal = "horizontal",
    Vertical = "vertical",
}

export interface IGaugeAttributes {
    accessors: IAccessors;
    scales: Scales;
    renderer: Renderer<IAccessors>;
}

interface IGaugeTools {
    accessorFunction: () => IAccessors;
    scaleFunction: () => Scales | IRadialScales;
    rendererFunction: () => Renderer<IAccessors>;
}

@Injectable({
    providedIn: "root",
})
export class GaugeService {
    public static QUANTITY_SERIES_ID = "quantity";
    public static REMAINDER_SERIES_ID = "remainder";
    public static THRESHOLD_MARKERS_SERIES_ID = "threshold-markers";

    public assembleSeriesSet(value: number,
                             max: number,
                             thresholds: IGaugeThreshold[],
                             mode: GaugeMode,
        valueColorAccessor?: DataAccessor): IChartAssistSeries<IAccessors>[] {
        const initialValue = value ?? 0;
        const initialMax = max ?? 0;
        const { accessors, scales, renderer } = this.getGaugeAttributes(mode);
        if (accessors.data) {
            accessors.data.color = valueColorAccessor || this.createDefaultValueColorAccessor(thresholds);
        }

        const chartAssistSeries: IChartAssistSeries<IAccessors>[] = [
            ...this.getGaugeData(initialValue, initialMax).map(s => ({
                ...s,
                accessors,
                scales,
                renderer,
            })),
        ];

        // TODO: generate threshold series for linear modes
        if (mode === GaugeMode.Radial) {
            chartAssistSeries.push(this.generateRadialThresholdSeries(initialValue, initialMax, thresholds, accessors, scales));
        }

        return chartAssistSeries;
    }

    public updateSeriesSet(value: number,
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

    public generateRadialThresholdSeries(value: number,
                                         max: number,
                                         thresholds: IGaugeThreshold[],
                                         accessors: IAccessors,
                                         scales: IRadialScales | Scales): IChartAssistSeries<IAccessors> {
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

    private getGaugeAttributes(mode: GaugeMode): IGaugeAttributes {
        const t: IGaugeTools = this.getGaugeTools(mode);
        const result: IGaugeAttributes = {
            accessors: t.accessorFunction(),
            renderer: t.rendererFunction(),
            scales: t.scaleFunction(),
        };

        return result;
    }

    private getGaugeTools(mode: GaugeMode): IGaugeTools {
        const chartTools: Record<GaugeMode, IGaugeTools> = {
            [GaugeMode.Radial]: {
                rendererFunction: () => new RadialRenderer(radialGaugeRendererConfig()),
                accessorFunction: () => new RadialAccessors(),
                scaleFunction: () => radialScales(),
            },
            [GaugeMode.Horizontal]: {
                rendererFunction: () => {
                    const renderer = new BarRenderer();
                    renderer.config.padding = 0;
                    renderer.config.strokeWidth = 0;
                    return renderer;
                },
                accessorFunction: () => new HorizontalBarAccessors(),
                scaleFunction: () => barScales({ horizontal: true }),
            },
            [GaugeMode.Vertical]: {
                // TODO
                rendererFunction: () => new RadialRenderer(radialGaugeRendererConfig()),
                accessorFunction: () => new RadialAccessors(),
                scaleFunction: () => radialScales(),
            },
        };

        return chartTools[mode];
    }

    private createDefaultValueColorAccessor(thresholds: IGaugeThreshold[]) {
        return (data: any, i: number, series: number[], dataSeries: IDataSeries<IAccessors>) => {
            if (dataSeries.id === GaugeService.REMAINDER_SERIES_ID) {
                return "var(--nui-color-semantic-unknown-bg-hover)";
            } else {
                if (!isUndefined(thresholds[1].value) && thresholds[1].value <= data.value) {
                    return "var(--nui-color-semantic-critical)";
                }
                if (!isUndefined(thresholds[0].value) && thresholds[0].value <= data.value) {
                    return "var(--nui-color-semantic-warning)";
                }
                return CHART_PALETTE_CS1[0];
            }
        };
    }

    private getGaugeData(value: number, max: number) {
        return [
            // category property is used for unifying the linear-style gauge visualization into a single bar stack
            { id: GaugeService.QUANTITY_SERIES_ID, data: [{ category: "gauge", value }] },
            { id: GaugeService.REMAINDER_SERIES_ID, data: [{ category: "gauge", value: max - value }] },
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
