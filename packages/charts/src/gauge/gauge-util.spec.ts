import { IAccessors, IDataSeries } from "../core/common/types";
import { GAUGE_LABEL_FORMATTER_NAME_DEFAULT } from "../core/plugins/gauge/constants";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

import {
    GaugeMode,
    GAUGE_QUANTITY_SERIES_ID,
    GAUGE_REMAINDER_SERIES_ID,
    GAUGE_THRESHOLD_MARKERS_SERIES_ID,
    StandardGaugeColor,
    StandardGaugeThresholdId,
} from "./constants";
import { GaugeUtil } from "./gauge-util";
import { IGaugeConfig, IGaugeLabelsConfig } from "./types";

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
            thresholds: GaugeUtil.createStandardThresholdsConfig(2, 4),
            labels: {},
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

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () => "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
                const formattedValue = seriesSet[0]?.scales.r.formatters?.[GAUGE_LABEL_FORMATTER_NAME_DEFAULT]?.("any old string");
                expect(formattedValue).toEqual(gaugeConfig.labels?.formatter?.(null));
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

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () => "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Horizontal);
                const formattedValue = seriesSet[0]?.scales.x.formatters?.[GAUGE_LABEL_FORMATTER_NAME_DEFAULT]?.("any old string");
                expect(formattedValue).toEqual(gaugeConfig.labels?.formatter?.(null));
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

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () => "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Vertical);
                const formattedValue = seriesSet[0]?.scales.y.formatters?.[GAUGE_LABEL_FORMATTER_NAME_DEFAULT]?.("any old string");
                expect(formattedValue).toEqual(gaugeConfig.labels?.formatter?.(null));
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

    describe("createDefaultColorAccessor", () => {
        it("should create a standard color accessor", () => {
            const colorAccessor = GaugeUtil.createDefaultQuantityColorAccessor();

            gaugeConfig.value = gaugeConfig.thresholds?.definitions[StandardGaugeThresholdId.Warning].value as number - 1;
            let seriesSet = GaugeUtil.assembleSeriesSet(gaugeConfig, GaugeMode.Donut);
            let quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(StandardGaugeColor.Ok);

            gaugeConfig.value = gaugeConfig.thresholds?.definitions[StandardGaugeThresholdId.Warning].value as number;
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, gaugeConfig);
            quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(
                gaugeConfig.thresholds?.definitions[StandardGaugeThresholdId.Warning].color);

            gaugeConfig.value = gaugeConfig.thresholds?.definitions[StandardGaugeThresholdId.Critical].value as number;
            seriesSet = GaugeUtil.updateSeriesSet(seriesSet, gaugeConfig);
            quantitySeries = seriesSet.find(s => s.id === GAUGE_QUANTITY_SERIES_ID) as IDataSeries<IAccessors<any>, any>;

            expect(colorAccessor(quantitySeries.data[0], 0, quantitySeries.data, quantitySeries)).toEqual(
                gaugeConfig.thresholds?.definitions[StandardGaugeThresholdId.Critical].color);
        });
    });

});
