import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { TextboxAtom } from "../textbox/textbox.atom";

const name: string = "Textbox";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTextbox: TextboxAtom;
    let placeholderTextbox: TextboxAtom;
    let readonlyTextbox: TextboxAtom;
    let requiredTextbox: TextboxAtom;
    let areaTextbox: TextboxAtom;
    let placeholderAreaTextbox: TextboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-visual-test");
        basicTextbox = Atom.find(TextboxAtom, "nui-visual-test-textbox-item");
        placeholderTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-placeholder-textbox-item"
        );
        readonlyTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-readonly-textbox-item"
        );
        requiredTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-required-textbox-item"
        );
        areaTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-area-textbox-item"
        );
        placeholderAreaTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-placeholder-area-textbox-item"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicTextbox.input.click();
        await placeholderTextbox.hover();
        await camera.say.cheese(
            "Basic Textbox is focused and Textbox with placeholder is hovered"
        );

        await requiredTextbox.acceptText("a");
        await readonlyTextbox.hover();
        await camera.say.cheese(
            "'a' was entered in required Textbox and readonly Textbox is hovered"
        );

        await areaTextbox.input.click();
        await placeholderAreaTextbox.hover();
        await camera.say.cheese(
            "Area Textbox is focused and Area Textbox with placeholder is hovered"
        );

        await camera.turn.off();
    }, 100000);
});
