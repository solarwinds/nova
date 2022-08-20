import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { ChipsAtom } from "./chips.atom";

const name: string = "Chips";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let chipsBasic: ChipsAtom;
    let chipsVertGroup: ChipsAtom;
    let chipsOverflow: ChipsAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chips/chips-visual-test");

        chipsBasic = Atom.find(
            ChipsAtom,
            "nui-demo-chips-flat-horizontal-visual"
        );
        chipsVertGroup = Atom.find(
            ChipsAtom,
            "nui-demo-chips-grouped-vertical-visual"
        );
        chipsOverflow = Atom.find(ChipsAtom, "nui-demo-chips-overflow");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        const chipselement = chipsBasic.getChipElement(2);
        await chipsBasic.hover(chipselement);
        await camera.say.cheese(`Hover effect`);

        await chipsBasic.removeItem(2);
        await chipsBasic.removeItem(3);
        await chipsVertGroup.clearAll();
        await camera.say.cheese(
            `Removed 2 chips and 'Clear All' vertical group`
        );

        await chipsOverflow.getChipsOverflowElement().click();
        await camera.say.cheese(`Open popup with overflow chips`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
