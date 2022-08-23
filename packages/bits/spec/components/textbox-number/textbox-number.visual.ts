import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { TextboxNumberAtom } from "../textbox-number/textbox-number.atom";

const name: string = "Textbox Number";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTextboxNumber: TextboxNumberAtom;
    let customTextboxNumber: TextboxNumberAtom;
    let disabledTextboxNumber: TextboxNumberAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-number-visual-test");
        basicTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number"
        );
        customTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number-min-max"
        );
        disabledTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number-disabled"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await disabledTextboxNumber.hover();
        await camera.say.cheese("Default");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await customTextboxNumber.acceptText("");
        await basicTextboxNumber.hover();
        await camera.say.cheese(
            "Basic TextboxNumber is hover and Custom TextboxNumber is focused"
        );

        await customTextboxNumber.clearText();
        await customTextboxNumber.acceptText("-3");
        await basicTextboxNumber.upButton.hover();
        await camera.say.cheese(
            "Validation error in Custom TextboxNumber and UpButton in Basic TextboxNumber is hovered"
        );

        await camera.turn.off();
    }, 100000);
});
