import { $, browser } from "protractor";

import { Atom } from "../../../atom";
import { TooltipAtom } from "../../../directives/tooltip/tooltip.atom";
import { Helpers } from "../../../helpers";

import { TimeFrameBarAtom } from "./time-frame-bar.atom";

describe("Visual tests: TimeFrameBar", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    const timeFrameBarFirst: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "first");
    const timeFrameBarSecond: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "second");
    const timeFrameBarNoQuickPick: TimeFrameBarAtom = Atom.find(TimeFrameBarAtom, "bar-no-quick-pick");
    const tooltip: TooltipAtom = Atom.findIn(TooltipAtom, $(".cdk-overlay-container"));

    beforeEach( async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("convenience/time-frame-bar/visual");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "TimeFrameBar");
        await timeFrameBarSecond.quickPickPreset("Last 7 days");
        await eyes.checkWindow("Default");

        await timeFrameBarFirst.prevButton.hover();
        await tooltip.waitToBeDisplayed();
        await eyes.checkWindow("With prev button hovered");

        await timeFrameBarSecond.popover.open();
        await eyes.checkWindow("With opened popover");
        await timeFrameBarSecond.popover.closeModal();

        await timeFrameBarNoQuickPick.popover.open();
        await eyes.checkWindow("With opened popover and no quick picker");
        await timeFrameBarNoQuickPick.popover.closeModal();

        await eyes.close();
    }, 100000);
});
