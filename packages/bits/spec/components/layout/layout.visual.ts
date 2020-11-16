import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { LayoutSheetGroupAtom } from "./layout-sheet-group.atom";

describe("Visual tests: Layout", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let separatedSheets: LayoutSheetGroupAtom;
    let joinedSheets: LayoutSheetGroupAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode("CSS");
        await Helpers.prepareBrowser("layout/layout-visual-test");
        separatedSheets = Atom.find(LayoutSheetGroupAtom, "nui-visual-test-layout-separated-sheet-group");
        joinedSheets = Atom.find(LayoutSheetGroupAtom, "nui-visual-test-layout-joined-sheet-group");
    });

    afterAll(async () => {
        eyes.setStitchMode("Scroll");
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Layout");
        await eyes.checkWindow("Default");

        await separatedSheets.hover(separatedSheets.getVerticalResizerByIndex(0));
        await eyes.checkWindow("Hovered HorizontalResizer");

        await separatedSheets.mouseDownVerticalResizerByIndex(0);
        await eyes.checkWindow("HorizontalResizer on MouseDown");

        await separatedSheets.mouseUp();
        await joinedSheets.hover(joinedSheets.getHorizontalResizerByIndex(1));
        await eyes.checkWindow("Hovered VerticalResizer");

        await joinedSheets.mouseDownHorizontalResizerByIndex(1);
        await eyes.checkWindow("VerticalResizer on MouseDown");

        await eyes.close();
    }, 100000);
});
