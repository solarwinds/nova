import { browser } from "protractor";

import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Message";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("message/message-visual-test");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
