import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

const name: string = "Line Chart";

describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let legend: LegendAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/line/visual-test");
        legend = Atom.findIn(
            LegendAtom,
            element(by.tagName("line-chart-with-axis-labels-example"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        await legend.getSeriesByIndex(1).hover();
        await camera.say.cheese(`${name} - Legend tile hovered`);

        await camera.turn.off();
    }, 100000);
});
