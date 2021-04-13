import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ExpanderAtom } from "../expander/expander.atom";

const name: string = "Expander";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;
    let customHeaderExpander: ExpanderAtom;
    let stakedExpander: ExpanderAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("expander/expander-visual-test");
        basicExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-basic");
        lineLessExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-without-border");
        customHeaderExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-custom-header");
        stakedExpander = Atom.find(ExpanderAtom, "nui-visual-test-staked-expander-1");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await basicExpander.toggle();
        await lineLessExpander.getExpanderToggleIcon().hover();
        await camera.say.cheese(`BasicExpander is toggled and Expander without expand line is hovered`);

        await basicExpander.toggle();
        await lineLessExpander.toggle();
        await lineLessExpander.toggle();
        await stakedExpander.toggle();
        await customHeaderExpander.hover();
        await camera.say.cheese(`Some expanders are in expanded state`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
