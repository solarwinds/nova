
import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ResizerAtom } from "../resizer/resizer.atom";

describe("Visual tests: Resizer", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let resizerNested1: ResizerAtom;
    let resizerNested2: ResizerAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("resizer/resizer-visual-test");
        resizerNested1 = Atom.find(ResizerAtom, "nui-visual-test-resize-nested-1");
        resizerNested2 = Atom.find(ResizerAtom, "nui-visual-test-resize-nested-2");
    });

    afterAll(async () => {
        // Remove type conversion once NUI-4870 is done
        await (eyes as any).abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Resizer");
        await eyes.checkWindow("Default");

        await resizerNested1.hover();
        await eyes.checkWindow("Hovered resizer");

        await browser.actions().mouseDown(resizerNested2.getElement()).perform();
        await eyes.checkWindow("Resizer on MouseDown");

        Helpers.switchDarkTheme("on");
        await resizerNested1.hover();
        await browser.actions().mouseDown(resizerNested2.getElement()).perform();
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 200000);
});
