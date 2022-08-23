import { browser } from "protractor";

import { Helpers } from "../helpers";
import { Camera } from "../virtual-camera/Camera";

const name: string = "Table Schematics";

// Enable after NUI-5702 is fixed
xdescribe(`Visual Tests: ${name}`, () => {
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("/schematics/table-outlet/visual-test");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await camera.turn.off();
    }, 300000);
});
