import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { GaugeUtil } from "../../src/gauge/gauge-util";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { TestPage } from "./test.po";

const name: string = "Gauge";

describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let gauge: ChartAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/gauge/visual-test");
        gauge = Atom.find(ChartAtom, "visual-test-gauge-high-value");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        const gaugeSeries = await gauge.getDataSeriesById(SeriesAtom, GaugeUtil.REMAINDER_SERIES_ID) as SeriesAtom;
        await gaugeSeries.hover();
        await camera.say.cheese(`${name} - Default look with gauge hovered`);

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);

        await camera.turn.off();
    }, 100000);
});
