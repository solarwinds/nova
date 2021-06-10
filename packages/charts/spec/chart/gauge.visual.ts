import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element, ElementFinder } from "protractor";
import { GAUGE_REMAINDER_SERIES_ID } from "../../src/gauge/constants";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { TestPage } from "./test.po";

const name: string = "Gauge";

describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let donutGauge: ChartAtom;
    let horizontalGauge: ChartAtom;
    let verticalGauge: ChartAtom;
    let enableWarningCb: ElementFinder;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/gauge/visual-test");
        donutGauge = Atom.find(ChartAtom, "visual-test-gauge-donut-high-value");
        horizontalGauge = Atom.find(ChartAtom, "visual-test-gauge-horizontal-medium-value");
        verticalGauge = Atom.find(ChartAtom, "visual-test-gauge-vertical-low-value");
        enableWarningCb = element(by.id("enable-warning"));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        let gaugeSeries = await donutGauge.getDataSeriesById(SeriesAtom, GAUGE_REMAINDER_SERIES_ID) as SeriesAtom;
        await gaugeSeries.hover();
        await camera.say.cheese(`${name} - Donut hovered`);

        gaugeSeries = await horizontalGauge.getDataSeriesById(SeriesAtom, GAUGE_REMAINDER_SERIES_ID) as SeriesAtom;
        await gaugeSeries.hover();
        await camera.say.cheese(`${name} - Horizontal hovered`);

        gaugeSeries = await verticalGauge.getDataSeriesById(SeriesAtom, GAUGE_REMAINDER_SERIES_ID) as SeriesAtom;
        await gaugeSeries.hover();
        await camera.say.cheese(`${name} - Vertical hovered`);

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);
        await page.disableDarkTheme();

        await enableWarningCb.click();
        await camera.say.cheese(`${name} - Warning thresholds disabled`);

        await camera.turn.off();
    }, 100000);
});
