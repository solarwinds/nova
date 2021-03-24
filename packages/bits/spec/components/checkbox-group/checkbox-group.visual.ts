import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { CheckboxGroupAtom } from "./checkbox-group.atom";

const name: string = "Checkbox Group";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let checkboxJustified: CheckboxGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-visual-test");
        checkboxJustified = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-justified");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await checkboxJustified.getFirst().hover();
        await camera.say.cheese(`First Checkbox in Justified Checkbox-Group is hovered`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
