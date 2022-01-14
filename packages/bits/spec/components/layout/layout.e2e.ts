import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { LayoutSheetAtom, LayoutSheetGroupAtom } from "../public_api";

describe("LAYOUT", () => {
    let sheetGroupInner: LayoutSheetGroupAtom;
    let sheetGroupOuter: LayoutSheetGroupAtom;
    let sheet: LayoutSheetAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("layout/layout-test");
        sheetGroupInner = Atom.find(
            LayoutSheetGroupAtom,
            "nui-demo-sheet-group--inner"
        );
        sheetGroupOuter = Atom.find(
            LayoutSheetGroupAtom,
            "nui-demo-sheet-group--outer"
        );
        sheet = Atom.find(LayoutSheetAtom, "nui-demo-sheet-group__sheet");
    });

    it("should resize right sheet border", async () => {
        const amountToResizeToTheRight = 200;
        const sheetWidthBefore = await sheet.getWidth();
        await sheetGroupInner.moveRightHorizontalResizerByIndex(
            1,
            amountToResizeToTheRight
        );
        const sheetWidthAfter = await sheet.getWidth();
        expect(sheetWidthAfter).toBe(
            sheetWidthBefore + amountToResizeToTheRight
        );
    });

    it("should resize left sheet border", async () => {
        const amountToResizeToTheLeft = 200;
        const sheetWidthBefore = await sheet.getWidth();
        await sheetGroupInner.moveLeftHorizontalResizerByIndex(
            0,
            amountToResizeToTheLeft
        );
        const sheetWidthAfter = await sheet.getWidth();
        expect(sheetWidthAfter).toBe(
            sheetWidthBefore + amountToResizeToTheLeft
        );
    });

    it("should resize upwards sheet-group border", async () => {
        const amountToResizeToTheTop = 200;
        const sheetHeightBefore = await sheet.getHeight();
        await sheetGroupOuter.moveUpVerticalResizerByIndex(
            0,
            amountToResizeToTheTop
        );
        const sheetHeightAfter = await sheet.getHeight();
        expect(sheetHeightAfter).toBe(
            sheetHeightBefore + amountToResizeToTheTop
        );
    });

    it("should resize downwards sheet-group border", async () => {
        const amountToResizeToTheTop = 100;
        const sheetHeightBefore = await sheet.getHeight();
        await sheetGroupOuter.moveDownVerticalResizerByIndex(
            0,
            amountToResizeToTheTop
        );
        const sheetHeightAfter = await sheet.getHeight();
        expect(sheetHeightAfter).toBe(
            sheetHeightBefore - amountToResizeToTheTop
        );
    });
});
