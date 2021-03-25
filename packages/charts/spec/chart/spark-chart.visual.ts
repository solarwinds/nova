import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";

const name: string = "Spark Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let firstChart: ChartAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/spark/multiple");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        firstChart = Atom.findIn(ChartAtom, element(by.tagName("nui-spark-chart-multiple-example")), 0);

        camera = new Camera().loadFilm(browser, name);
    });

    it("Default look", async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await firstChart.hover();
        await camera.say.cheese(`${name} - After hover`);

        await camera.turn.off();
    }, 100000);
});
