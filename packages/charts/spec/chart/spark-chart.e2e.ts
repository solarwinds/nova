import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { LineSeriesAtom } from "./atoms/line-series.atom";
import { InteractiveBooster } from "./boosters/interactive.booster";
import { ZoomBooster } from "./boosters/zoom.booster";
import { SparkChartTestPage } from "./spark-chart-test.po";

describe("Spark chart", () => {
    const page = new SparkChartTestPage();
    const sparkStackClassName = "nui-spark-chart-multiple-test";
    const xTicks = [0, 100, 200, 300, 400]; // for 5 datapoints and grid width of 400px
    const data = [[10, 4, 7, 15, 20], [20, 5, 15, 6, 5], [0, 12, 18, 3, 23]];
    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white"];
    const rgbaColors = [
        "rgba(255, 0, 0, 1)",
        "rgba(255, 165, 0, 1)",
        "rgba(255, 255, 0, 1)",
        "rgba(0, 128, 0, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(128, 0, 128, 1)",
        "rgba(0, 0, 0, 1)",
        "rgba(255, 255, 255, 1)",
    ];

    const getYCoordinate = (value: number): number => 31 - value// 31 = 26px of height + 5px of top padding. Zero is at the top for y-axis.;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/spark/test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        await page.changeData(data);
    });

    describe("by default", () => {
        it("should render line chart for every data series", async () => {
            await expect(await page.getSparkCountInStack(sparkStackClassName)).toEqual(data.length);
        });

        it("should show legend for every data series", async () => {
            await expect(await page.getLegendSeriesCount()).toEqual(data.length);
        });

        it("should have different color per series", async () => {
            for (let i = 0; i < data.length; i++) {
                const expectedColor = colors[i];

                const chart = page.getChart(i);
                const line = await chart.getDataSeriesById(LineSeriesAtom, (i + 1).toString());
                const markerSeries = await chart.getMarkerSeriesById((i + 1).toString());
                const marker = markerSeries?.getMarker(0);
                const legend = page.getLegendSeries(i);

                await expect(await line?.getColor()).toEqual(expectedColor);
                await expect(await marker?.getColor()).toEqual(expectedColor);
                await expect(await legend.richTile.getBackgroundColor()).toEqual(rgbaColors[i]);
            }

            await expect(await page.getLegendSeriesCount()).toEqual(data.length);
        });
    });

    describe("after hovering second data point in first chart", () => {
        const pointIndex = 1;

        beforeAll(async () => {
            await InteractiveBooster.hover(page.getChart(0), { x: xTicks[pointIndex], y: getYCoordinate(10) });
        });

        afterAll(async () => {
            await browser.actions().mouseMove(page.getChart(0).getElement(), { x: 0, y: 0 }).perform();
        });

        it("should highlight corresponding data points in all charts", async () => {
            for (let i = 0; i < data.length; i++) {
                const dataValue = data[i][pointIndex];
                const chart = page.getChart(i);
                const legend = page.getLegendSeries(i);
                const legendValue = await legend.richTile.getValue();
                const markerSeries = await chart.getMarkerSeriesById((i + 1).toString());
                const marker = markerSeries?.getMarker(0);
                const markerPosition = await marker?.getPosition();

                await expect(parseInt(legendValue, 10)).toEqual(dataValue);
                await expect(markerPosition?.x).toEqual(xTicks[pointIndex]);
                await expect(markerPosition?.y).toEqual(getYCoordinate(dataValue));
            }
        });

        it("should make all legend series active", async () => {
            for (let i = 0; i < data.length; i++) {
                const legend = page.getLegendSeries(i);
                await expect(await legend.isActive()).toEqual(true);
            }
        });
    });

    describe("after click on the legend", () => {
        beforeAll(async () => {
            await page.getLegendSeries(0).getElement().click();
        });

        it("should keep all series visible", async () => {
            await expect(await page.getSparkCountInStack(sparkStackClassName)).toEqual(data.length);
            for (let i = 0; i < data.length; i++) {
                await expect(await page.getChart(i).getNumberOfVisibleDataSeries()).toEqual(1);
            }
        });
    });

    describe("zoom", () => {
        it("should not be possible", async () => {
            const chart = page.getChart(0);
            const firstLine = await chart.getDataSeriesById(LineSeriesAtom, "1");
            const pointsBefore = await firstLine?.getPoints();
            await ZoomBooster.zoom(
                chart,
                { x: xTicks[1], y: getYCoordinate(50) },
                { x: xTicks[2], y: getYCoordinate(50) }
            );
            await expect(await firstLine?.getPoints()).toEqual(pointsBefore);
        });
    });

});
