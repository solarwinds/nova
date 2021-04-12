import { BarRenderer } from "../renderers/bar/bar-renderer";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

import { GaugeMode, GAUGE_QUANTITY_SERIES_ID, GAUGE_REMAINDER_SERIES_ID, GAUGE_THRESHOLD_MARKERS_SERIES_ID } from "./constants";
import { GaugeUtil } from "./gauge-util";
import { IGaugeConfig } from "./types";

describe("GaugeUtil >", () => {
    const gaugeConfig: IGaugeConfig = {
        value: 3,
        max: 10,
        thresholds: [2],
    };

    describe("assembleSeriesSet", () => {
        it("should generate a series set for a donut gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.thresholds[0]);
            expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
        });

        it("should generate a series set for a horizontal gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Horizontal);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.thresholds[0]);
            expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
        });

        it("should generate a series set for a vertical gauge", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Vertical);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.thresholds[0]);
            expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
        });
    });

    describe("updateSeriesSet", () => {
        it("should update the gauge's series set", () => {
            const updatedGaugeConfig = { ...gaugeConfig, value: 5 };

            let seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, updatedGaugeConfig);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);

            expect(series?.data[0].value).toEqual(updatedGaugeConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(updatedGaugeConfig.max - updatedGaugeConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(updatedGaugeConfig.thresholds[0]);
            expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
        });
    });
});
