import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";
import { ILocation } from "selenium-webdriver";

import { LineSeriesAtom } from "./atoms/line-series.atom";
import { MarkerAtom } from "./atoms/marker.atom";
import { InteractiveBooster } from "./boosters/interactive.booster";
import { ZoomBooster } from "./boosters/zoom.booster";
import { LineChartTestPage } from "./line-chart-test.po";

describe("Line chart", () => {
    const page = new LineChartTestPage();
    const xTicks = [0, 100, 200, 300, 400]; // for 5 datapoints and grid width of 400px
    const data = [[60, 40, 70, 45, 90], [30, 95, 15, 60, 35]];
    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white"];

    const getYCoordinate = (value: number): number => 105 - value// 105 = 100px of height + 5px of padding. Zero is at the top for y-axis.;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/line/test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        await page.changeData(data);
    });

    describe("by default", () => {
        it("should render 2 lines in basic line chart", async () => {
            await expect(await page.chart.getNumberOfVisibleDataSeries()).toEqual(2);
        });

        it("should have markers in basic line chart", async () => {
            await expect(await page.chart.getNumberOfSeriesWithMarkers()).toEqual(2);
        });
    });

    describe("lines", () => {
        let firstLine: LineSeriesAtom | undefined;
        let secondLine: LineSeriesAtom | undefined;
        let firstLinePoints: ILocation[] | undefined;
        let secondLinePoints: ILocation[]  | undefined;

        beforeAll(async () => {
            firstLine = await page.chart.getDataSeriesById(LineSeriesAtom, "1");
            secondLine = await page.chart.getDataSeriesById(LineSeriesAtom, "2");
            firstLinePoints = await firstLine?.getPoints();
            secondLinePoints = await secondLine?.getPoints();
        });

        it("should have proper color", async () => {
            await expect(await firstLine?.getColor()).toEqual(colors[0]);
            await expect(await secondLine?.getColor()).toEqual(colors[1]);
        });

        // TODO: Re-enable after NUI-4162 is done.
        xit("should connect proper data points", async () => {
            for (let i = 0; i < xTicks.length; i++) {
                const x = xTicks[i];
                const y1 = getYCoordinate(data[0][i]);
                const y2 = getYCoordinate(data[1][i]);
                await expect(firstLinePoints?.[i]).toEqual({ x, y: y1 });
                await expect(secondLinePoints?.[i]).toEqual({ x, y: y2 });
            }
        });
    });

    describe("markers", () => {
        let marker1: MarkerAtom | undefined;
        let marker2: MarkerAtom | undefined;

        beforeAll(async () => {
            marker1 = (await page.chart.getMarkerSeriesById("1"))?.getMarker(0);
            marker2 = (await page.chart.getMarkerSeriesById("2"))?.getMarker(0);
        });

        it("should have proper color", async () => {
            await expect(await marker1?.getColor()).toEqual(colors[0]);
            await expect(await marker2?.getColor()).toEqual(colors[1]);
        });

        it("should be in positions corresponding to last data points by default", async () => {
            const index = xTicks.length - 1; // 4 - await expected highlighted data point index
            const position1 = await marker1?.getPosition();
            const position2 = await marker2?.getPosition();

            await expect(position1?.x).toEqual(xTicks[index]);
            await expect(position2?.x).toEqual(xTicks[index]);
            await expect(position1?.y).toEqual(getYCoordinate(data[0][index]));
            await expect(position2?.y).toEqual(getYCoordinate(data[1][index]));
        });

        describe("after highlighting of the second data point", () => {
            const index = 1;

            beforeAll(async () => {
                await InteractiveBooster.hover(page.chart, { x: xTicks[index], y: getYCoordinate(50) });
            });

            afterAll(async () => {
                await browser.actions().mouseMove(page.chart.getElement(), { x: 0, y: 0 }).perform();
            });

            it("should be moved to correct positions", async () => {
                const position1 = await marker1?.getPosition();
                const position2 = await marker2?.getPosition();

                await expect(position1?.x).toEqual(xTicks[index]);
                await expect(position2?.x).toEqual(xTicks[index]);
                await expect(position1?.y).toEqual(getYCoordinate(data[0][index]));
                await expect(position2?.y).toEqual(getYCoordinate(data[1][index]));
            });
        });
    });

    describe("zoom", () => {
        it("should be disabled by default", async () => {
            const firstLine = await page.chart.getDataSeriesById(LineSeriesAtom, "1");
            const pointsBefore = await firstLine?.getPoints();
            await ZoomBooster.zoom(
                page.chart,
                { x: xTicks[1], y: getYCoordinate(50) },
                { x: xTicks[2], y: getYCoordinate(50) }
            );
            await expect(await firstLine?.getPoints()).toEqual(pointsBefore);
        });
    });

});
