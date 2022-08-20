import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

const name: string = "Area Chart";

describe(`Visual Tests: Charts - ${name}`, () => {
    let legend: LegendAtom;
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/area/test");
        legend = Atom.findIn(
            LegendAtom,
            element(by.tagName("area-chart-bi-directional-example"))
        );
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        await legend.getSeriesByIndex(1).hover();
        await camera.say.cheese(`${name} - Legend series hovered`);

        await camera.turn.off();
    }, 100000);
});
