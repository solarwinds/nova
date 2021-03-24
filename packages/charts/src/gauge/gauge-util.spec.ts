import { BarRenderer } from "../renderers/bar/bar-renderer";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

import { GaugeMode } from "./constants";
import { GaugeUtil } from "./gauge-util";
import { IGaugeSeriesConfig } from "./types";

describe("GaugeUtil >", () => {
    const seriesConfig: IGaugeSeriesConfig = {
        value: 3,
        max: 10,
        thresholds: [2],
    };

    describe("assembleSeriesSet", () => {
        it("should generate a series set for a donut gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(seriesConfig, GaugeMode.Donut);
            let series = seriesSet.find(s => s.id === GaugeUtil.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.max - seriesConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.thresholds[0]);
            expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
        });

        it("should generate a series set for a horizontal gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(seriesConfig, GaugeMode.Horizontal);
            let series = seriesSet.find(s => s.id === GaugeUtil.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.max - seriesConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.thresholds[0]);
            expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
        });

        it("should generate a series set for a vertical gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(seriesConfig, GaugeMode.Vertical);
            let series = seriesSet.find(s => s.id === GaugeUtil.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.max - seriesConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(seriesConfig.thresholds[0]);
            expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
        });
    });

    describe("updateSeriesSet", () => {
        it("should update the gauge's series set", () => {
            const updatedSeriesConfig = { ...seriesConfig, value: 5 };

            let seriesSet = GaugeUtil.assembleSeriesSet(seriesConfig, GaugeMode.Donut);
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, updatedSeriesConfig);
            let series = seriesSet.find(s => s.id === GaugeUtil.QUANTITY_SERIES_ID);

            expect(series?.data[0].value).toEqual(updatedSeriesConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(updatedSeriesConfig.max - updatedSeriesConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeUtil.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(updatedSeriesConfig.thresholds[0]);
            expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
        });
    });
});
