import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

import { ChartAtom } from "./atoms/chart.atom";
import { TestPage } from "./test.po";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Charts - Thresholds on Line Chart with Summary Section", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let singleSeriesChart: ChartAtom;
    let multiSeriesChart1Legend: LegendAtom;
    let multiSeriesChart2Legend: LegendAtom;
    const page = new TestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.Scroll);
        await Helpers.prepareBrowser("thresholds/summary-visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        singleSeriesChart = Atom.findIn(ChartAtom, element(by.css(".nui-thresholds-summary-single-1")), 0);
        multiSeriesChart1Legend = Atom.findIn(LegendAtom, element(by.css(".nui-thresholds-summary-multiple-1")));
        multiSeriesChart2Legend = Atom.findIn(LegendAtom, element(by.css(".nui-thresholds-summary-multiple-2")));
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.CSS);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Thresholds On Line Chart");
        await multiSeriesChart1Legend.getSeriesByIndex(0).richTile.getElement().click();
        await multiSeriesChart2Legend.getSeriesByIndex(0).richTile.hover();
        await eyes.checkWindow("Default");

        await multiSeriesChart1Legend.getSeriesByIndex(1).richTile.getElement().click();
        await multiSeriesChart2Legend.getSeriesByIndex(0).richTile.getElement().click();
        await eyes.checkWindow("Hover over unselected legend");

        await singleSeriesChart.hover();
        await eyes.checkWindow("Hover over main chart");

        await page.enableDarkTheme();
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);

});
