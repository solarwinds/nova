import { BarRenderer } from "../renderers/bar/bar-renderer";
import { RadialGaugeThresholdsRenderer } from "../renderers/radial/radial-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

import { GaugeMode } from "./constants";
import { GaugeService } from "./gauge.service";

describe("GaugeService >", () => {
    let service: GaugeService;

    beforeAll(() => {
        service = new GaugeService();
    });

    describe("assembleSeriesSet", () => {
        const value = 3;
        const max = 10;
        const thresholds = [{ value: 2 }];

        it("should generate a series set for a radial gauge", () => {
            const seriesSet = service.assembleSeriesSet(value, max, thresholds, GaugeMode.Radial);
            let series = seriesSet.find(s => s.id === GaugeService.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(max - value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(thresholds[0].value);
            expect(series?.renderer instanceof RadialGaugeThresholdsRenderer).toEqual(true);
        });

        it("should generate a series set for a horizontal gauge", () => {
            const seriesSet = service.assembleSeriesSet(value, max, thresholds, GaugeMode.Horizontal);
            let series = seriesSet.find(s => s.id === GaugeService.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(max - value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.THRESHOLD_MARKERS_SERIES_ID);
        });

        it("should generate a series set for a radial gauge", () => {
            const seriesSet = service.assembleSeriesSet(value, max, thresholds, GaugeMode.Vertical);
            let series = seriesSet.find(s => s.id === GaugeService.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(max - value);
            expect(series?.renderer instanceof BarRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.THRESHOLD_MARKERS_SERIES_ID);
        });
    });

    describe("updateSeriesSet", () => {
        it("should update the gauge's series set", () => {
            const updatedValue = 5;
            const max = 10;
            const thresholds = [{ value: 2 }];

            let seriesSet = service.assembleSeriesSet(3, 10, [{ value: 2 }], GaugeMode.Radial);
            seriesSet = service.updateSeriesSet(updatedValue, 10, [{ value: 2 }], seriesSet);
            let series = seriesSet.find(s => s.id === GaugeService.QUANTITY_SERIES_ID);
            expect(series?.data[0].value).toEqual(updatedValue);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(max - updatedValue);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(s => s.id === GaugeService.THRESHOLD_MARKERS_SERIES_ID);
            expect(series?.data[0].value).toEqual(thresholds[0].value);
            expect(series?.renderer instanceof RadialGaugeThresholdsRenderer).toEqual(true);
        });
    });

});
