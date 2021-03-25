import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { IconAtom } from "../icon/icon.atom";

const name: string = "Icon";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        iconBasic: IconAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("icon/icon-visual-test");
        iconBasic = Atom.find(IconAtom, "nui-icon-test-basic-usage");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await iconBasic.hover();
        await camera.say.cheese(`Default with hover`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
