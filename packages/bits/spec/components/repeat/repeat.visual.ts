import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { RepeatAtom } from "./repeat.atom";

const name: string = "Repeat";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let singleSelectList: RepeatAtom;
    let singleSelectListRequired: RepeatAtom;
    let reorderSelectList: RepeatAtom;
    let toggleDragging: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("repeat/repeat-visual-test");
        singleSelectList = Atom.find(RepeatAtom, "nui-demo-single-highlight");
        singleSelectListRequired = Atom.find(
            RepeatAtom,
            "nui-demo-single-required-selection"
        );
        reorderSelectList = Atom.find(RepeatAtom, "nui-demo-reorder-config");
        toggleDragging = browser.element(by.css(".nui-switch__bar"));
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await singleSelectList.hover();
        await camera.say.cheese(
            `Repeat in Required Single Selection Mode with Radio Buttons`
        );

        await singleSelectListRequired.hover();
        await camera.say.cheese(
            `Repeat in Single Selection Mode with Item Highlight`
        );

        await reorderSelectList.hover();
        await camera.say.cheese(`Item Drag/Drop Enabled`);

        await toggleDragging.click();
        await camera.say.cheese(`Item Drag/Drop Disabled`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
