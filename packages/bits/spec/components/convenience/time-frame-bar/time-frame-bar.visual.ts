import { $, browser } from "protractor";

import { Atom } from "../../../atom";
import { TooltipAtom } from "../../../directives/tooltip/tooltip.atom";
import { Helpers } from "../../../helpers";
import { Camera } from "../../../virtual-camera/Camera";

import { TimeFrameBarAtom } from "./time-frame-bar.atom";

const name: string = "TimeFrameBar";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    const timeFrameBarFirst: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "first");
    const timeFrameBarSecond: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "second");
    const timeFrameBarNoQuickPick: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "bar-no-quick-pick");
    const tooltip: TooltipAtom = Atom.findIn(TooltipAtom, $(".cdk-overlay-container"));

    beforeAll(async () => {
        await Helpers.prepareBrowser("convenience/time-frame-bar/visual");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await timeFrameBarSecond.quickPickPreset("Last 7 days");
        await camera.say.cheese(`Default with quick preset`);

        await timeFrameBarFirst.prevButton.hover();
        await tooltip.waitToBeDisplayed();
        await camera.say.cheese(`With prev button hovered`);

        await timeFrameBarSecond.popover.open();
        await camera.say.cheese(`With opened popover`);
        await timeFrameBarSecond.popover.closeModal();

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await timeFrameBarNoQuickPick.popover.open();
        await camera.say.cheese(`With opened popover and no quick picker`);
        await timeFrameBarNoQuickPick.popover.closeModal();


        await camera.turn.off();
    }, 100000);
});
