import { by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, ContentAtom } from "../public_api";

// region Test cases
describe("USERCONTROL content: ", () => {
    let atom: ContentAtom;
    let testSmallElement: ElementFinder;
    let testLargeElement: ElementFinder;
    let contentSmallElem: ElementFinder;
    let contentLargeElem: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("content");

        atom = Atom.find(ContentAtom, "test-element-small");

        testSmallElement = element(by.id("test-element-small"));
        contentSmallElem = testSmallElement.element(by.className("nui-content"));

        testLargeElement = element(by.id("test-element-large"));
        contentLargeElem = testLargeElement.element(by.className("nui-content"));
    });

    it("should display passed content", async () => {
        const btnAtom = Atom.find(ButtonAtom, "test-element");
        expect(await btnAtom.getElement().getText()).toEqual("Click");
        await btnAtom.click();
        expect(await btnAtom.getElement().getText()).toEqual("Clicked!");
    });

    it("should have scrollbar if its size is too small for content", async () => {
        expect(await atom.hasScrollbar(contentSmallElem)).toBe(true);
    });

    xit("should hide scrollbar if its size is enough space for content", async () => {
        expect(await atom.hasScrollbar(contentLargeElem)).toBe(false);
    });
});
// endregion
