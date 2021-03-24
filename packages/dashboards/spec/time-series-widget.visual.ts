import { Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

const name: string = "Dashboards - Time Series Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/timeseries");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await camera.turn.off();
    }, 100000);
});
