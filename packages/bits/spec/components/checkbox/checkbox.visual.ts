import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { CheckboxAtom } from "../public_api";

const name: string = "Checkbox";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        checkboxBasic: CheckboxAtom,
        checkboxSpecial: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        checkboxBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        checkboxSpecial = Atom.find(CheckboxAtom, "nui-demo-checkbox-special");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await checkboxBasic.hover(checkboxBasic.getLabel());
        await camera.say.cheese(`Basic checkbox hovered`);

        await checkboxSpecial.hoverLink();
        await camera.say.cheese(`Special template of checkbox`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
