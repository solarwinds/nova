import { IAccessors, IDataSeries } from "../core/common/types";
import { GAUGE_LABEL_FORMATTER_NAME_DEFAULT } from "../core/plugins/gauge/constants";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

import { GaugeMode, GAUGE_QUANTITY_SERIES_ID, GAUGE_REMAINDER_SERIES_ID, GAUGE_THRESHOLD_MARKERS_SERIES_ID, StandardGaugeColor, StandardGaugeThresholdId } from "./constants";
import { GaugeUtil } from "./gauge-util";
import { IGaugeConfig } from "./types";

describe("GaugeUtil >", () => {
    let gaugeConfig: IGaugeConfig;
    let consoleWarnFn: any;

    beforeAll(() => {
        // suppress console warning
        consoleWarnFn = console.warn;
        console.warn = () => null;
    });

    afterAll(() => {
        // restore console warning
        console.warn = consoleWarnFn;
    });

    beforeEach(() => {
        gaugeConfig = {
            value: 3,
            max: 10,
            thresholds: GaugeUtil.createStandardThresholdConfigs(2, 4),
        };
    });

    describe("assembleSeriesSet", () => {
        it("should clamp the value to the max if it's larger than the max", () => {
            gaugeConfig.max = 10;
            gaugeConfig.value = 15;

            const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.max);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(0);
        });

        describe("for 'donut' mode", () => {
            it("should generate a series set", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
                let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof RadialRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
                expect(series?.renderer instanceof RadialRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
                const thresholds = GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
            });
        });

        describe("for 'horizontal' mode", () => {
            it("should generate a series", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Horizontal);
                let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
                const thresholds = GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
            });
        });

        describe("for 'vertical' mode", () => {
            it("should generate a series set", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Vertical);
                let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
                expect(series?.data[0].value).toEqual(gaugeConfig.max - gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
                const thresholds = GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(series?.renderer instanceof LinearGaugeThresholdsRenderer).toEqual(true);
            });
        });
    });

    describe("updateSeriesSet", () => {
        it("should clamp the value to the max if it's larger than the max", () => {
            gaugeConfig.max = 10;
            const updatedGaugeConfig = { ...gaugeConfig, value: 15 };

            let seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, updatedGaugeConfig);
            let series = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(gaugeConfig.max);
            series = seriesSet.find(s => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(0);
        });

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
            const thresholds = GaugeUtil.prepareThresholdsData(updatedGaugeConfig).thresholds;
            expect(series?.data[0].value).toEqual(thresholds?.[0].value);
            expect(series?.renderer instanceof DonutGaugeThresholdsRenderer).toEqual(true);
        });
    });

    describe("setThresholdLabelFormatter", () => {
        it("should update the formatter on the threshold series", () => {
            let seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            const formatter = () => "test";
            seriesSet = GaugeUtil.setThresholdLabelFormatter(formatter, seriesSet);
            const thresholdsSeries = seriesSet.find(s => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID);
            const formattedValue = thresholdsSeries?.scales.r.formatters?.[GAUGE_LABEL_FORMATTER_NAME_DEFAULT]?.("any old string");
            expect(formattedValue).toEqual(formatter());
        });
    });

    describe("createDefaultColorAccessor", () => {
        it("should create a standard color accessor", () => {
            const colorAccessor = GaugeUtil.createDefaultQuantityColorAccessor();

            gaugeConfig.value = gaugeConfig.thresholds?.[StandardGaugeThresholdId.Warning].value as number - 1;
            let seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            let quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(StandardGaugeColor.Ok);

            gaugeConfig.value = gaugeConfig.thresholds?.[StandardGaugeThresholdId.Warning].value as number;
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, gaugeConfig);
            quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(
                gaugeConfig.thresholds?.[StandardGaugeThresholdId.Warning].color);

            gaugeConfig.value = gaugeConfig.thresholds?.[StandardGaugeThresholdId.Critical].value as number;
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, gaugeConfig);
            quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(
                gaugeConfig.thresholds?.[StandardGaugeThresholdId.Critical].color);
        });
    });

});
