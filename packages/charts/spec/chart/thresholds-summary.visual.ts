import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

import { ChartAtom } from "./atoms/chart.atom";
import { TestPage } from "./test.po";

const name: string = "Thresholds on Line Chart with Summary Section";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let singleSeriesChart: ChartAtom;
    let multiSeriesChart1Legend: LegendAtom;
    let multiSeriesChart2Legend: LegendAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("thresholds/summary-visual-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        singleSeriesChart = Atom.findIn(
            ChartAtom,
            element(by.css(".nui-thresholds-summary-single-1")),
            0
        );
        multiSeriesChart1Legend = Atom.findIn(
            LegendAtom,
            element(by.css(".nui-thresholds-summary-multiple-1"))
        );
        multiSeriesChart2Legend = Atom.findIn(
            LegendAtom,
            element(by.css(".nui-thresholds-summary-multiple-2"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await multiSeriesChart1Legend
            .getSeriesByIndex(0)
            .richTile.getElement()
            .click();
        await multiSeriesChart2Legend.getSeriesByIndex(0).richTile.hover();
        await camera.say.cheese(`${name} - Default`);

        await multiSeriesChart1Legend
            .getSeriesByIndex(1)
            .richTile.getElement()
            .click();
        await multiSeriesChart2Legend
            .getSeriesByIndex(0)
            .richTile.getElement()
            .click();
        await camera.say.cheese(`${name} - Hover over unselected legend`);

        await singleSeriesChart.hover();
        await camera.say.cheese(`${name} - Hover over main chart`);

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);

        await camera.turn.off();
    }, 100000);
});
