import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { ButtonAtom } from "./button.atom";

const name: string = "Button";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        basicButton: ButtonAtom,
        primaryButton: ButtonAtom,
        actionButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("button/button-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicButton = Atom.find(ButtonAtom, "basic-button");
        primaryButton = Atom.find(ButtonAtom, "primary-button");
        actionButton = Atom.find(ButtonAtom, "action-button");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await basicButton.hover();
        await camera.say.cheese(`Hover on basic button`);

        await basicButton.mouseDown();
        await camera.say.cheese(`After basic button mouse down`);
        await basicButton.mouseUp();

        await primaryButton.hover();
        await camera.say.cheese(`Hover on primary button`);

        await primaryButton.mouseDown();
        await camera.say.cheese(`After primary button mouse down`);
        await primaryButton.mouseUp();

        await actionButton.hover();
        await camera.say.cheese(`Hover on action button`);

        await actionButton.mouseDown();
        await camera.say.cheese(`After action button mouse down`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    }, 100000);
});
