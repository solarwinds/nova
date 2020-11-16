import { ConnectedPosition } from "@angular/cdk/overlay";

import { IRadialAccessors, RadialAccessors } from "../../../renderers/radial/accessors/radial-accessors";
import { radialPreprocessor } from "../../../renderers/radial/radial-preprocessor";
import { RadialRenderer } from "../../../renderers/radial/radial-renderer";
import { radialScales } from "../../../renderers/radial/radial-scales";
import { Chart } from "../../chart";
import { IRadialScales, Scales } from "../../common/scales/types";
import { IDataPoint, IDataPointsPayload, IDataSeries } from "../../common/types";
import { GridConfig } from "../../grid/config/grid-config";
import { RadialGrid } from "../../grid/radial-grid";
import { IGrid } from "../../grid/types";

import { RadialTooltipsPlugin } from "./radial-tooltips-plugin";

function createDataPoint(startAngle = 0, endAngle = 0): IDataPoint {
    return {
        seriesId: "series-1",
        // @ts-ignore: Disabled for testing purposes
        dataSeries: null,
        index: 0,
        data: {
            startAngle: startAngle,
            endAngle: endAngle,
        },
        position: {
            x: 0,
            y: 0,
        },
    };
}

describe("RadialTooltipsPlugin >", () => {

    let grid: IGrid;
    let chart: Chart;
    let plugin: RadialTooltipsPlugin;
    let scales: IRadialScales;
    let renderer: RadialRenderer;
    let offsetParentSpy: jasmine.Spy;

    const getSeriesSet = () => {
        const donutSeriesSet: IDataSeries<IRadialAccessors>[] = [{
            id: "series-1",
            name: "series-1",
            data: [{ value: 10 }],
            accessors: new RadialAccessors(),
        }];

        return radialPreprocessor(donutSeriesSet.map(dataSeries => ({
            ...dataSeries,
            scales,
            renderer,
        })), () => true);
    };

    beforeEach(() => {
        scales = radialScales();
        renderer = new RadialRenderer();

        grid = new RadialGrid();

        const config = new GridConfig();
        const dimension = config.dimension;
        dimension.autoWidth = false;
        dimension.autoHeight = false;
        dimension.height(100);
        dimension.width(100);
        dimension.margin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        };
        grid.config(config);

        const root = document.createElement("div");
        offsetParentSpy = spyOnProperty(root, "offsetParent");
        offsetParentSpy.and.returnValue({ getBoundingClientRect: () => ({ top: 0, left: 0 }) });

        chart = new Chart(grid);
        chart.build(root);

        chart.update(getSeriesSet());

        plugin = new RadialTooltipsPlugin(0);
        chart.addPlugin(plugin);
        chart.initialize();
    });

    describe("Position", () => {
        const expectations: { x: "start" | "center" | "end", y: "top" | "center" | "bottom" }[] = [
            { x: "center", y: "top" },
            { x: "end", y: "top" },
            { x: "end", y: "center" },
            { x: "end", y: "bottom" },
            { x: "center", y: "bottom" },
            { x: "start", y: "bottom" },
            { x: "start", y: "center" },
            { x: "start", y: "top" },
        ];
        const OPPOSITE: { [key: string]: string } = {
            "start": "end",
            "end": "start",
            "top": "bottom",
            "bottom": "top",
            "center": "center",
        };

        for (let i = 0; i < 8; i++) {
            it("should set a right position for section " + i, () => {
                const pi = Math.PI;
                const angle = i * (pi / 4);
                const dataPoints: IDataPointsPayload = {
                    "series-1": createDataPoint(angle - pi / 8, angle + pi / 8),
                };
                plugin.processHighlightedDataPoints(dataPoints);

                const position = plugin.dataPointPositions["series-1"];
                const expectedOverlayPositions: ConnectedPosition[] = [{
                    originX: expectations[i].x,
                    originY: expectations[i].y,
                    overlayX: <"start" | "center" | "end">OPPOSITE[expectations[i].x],
                    overlayY: <"top" | "center" | "bottom">OPPOSITE[expectations[i].y],
                }];

                expect(position.overlayPositions).toEqual(expectedOverlayPositions);
            });
        }

        it("adjusts absolute position according to grid dimensions", () => {
            const dataPoints: IDataPointsPayload = {
                "series-1": createDataPoint(),
            };

            const testOffsetParentValue = 5;
            offsetParentSpy.and.returnValue({ getBoundingClientRect: () => ({ top: testOffsetParentValue, left: testOffsetParentValue }) });

            scales.r.range([0, 0]);
            plugin.processHighlightedDataPoints(dataPoints);
            const position = plugin.dataPointPositions["series-1"];

            expect(Math.abs(position.x + testOffsetParentValue - grid.config().dimension.width() / 2) < 0.0001).toBe(true);
            expect(Math.abs(position.y + testOffsetParentValue - grid.config().dimension.height() / 2) < 0.0001).toBe(true);
        });

    });

});
