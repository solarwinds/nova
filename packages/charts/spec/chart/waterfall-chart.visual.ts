import { browser } from "protractor";

import { Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

const name: string = "Waterfall Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/waterfall/test");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await camera.turn.off();
    }, 100000);
});
