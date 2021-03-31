
import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ResizerAtom } from "../resizer/resizer.atom";

const name: string = "Resizer";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let resizerNested1: ResizerAtom;
    let resizerNested2: ResizerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("resizer/resizer-visual-test");
        resizerNested1 = Atom.find(ResizerAtom, "nui-visual-test-resize-nested-1");
        resizerNested2 = Atom.find(ResizerAtom, "nui-visual-test-resize-nested-2");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await resizerNested1.hover();
        await camera.say.cheese("Hovered resizer");

        await browser.actions().mouseDown(resizerNested2.getElement()).perform();
        await camera.say.cheese("Resizer on MouseDown");

        Helpers.switchDarkTheme("on");
        await resizerNested1.hover();
        await browser.actions().mouseDown(resizerNested2.getElement()).perform();
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    }, 200000);
});
