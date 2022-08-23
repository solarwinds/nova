import { browser, by, element } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { LegendAtom } from "../legend/legend.atom";

const name: string = "Stacked Area Chart Two Directional";

describe(`Visual Tests: Charts - ${name}`, () => {
    let legend: LegendAtom;
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "chart-types/area/bi-directional-stacked-test"
        );
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        await camera.turn.off();
    }, 100000);
});
