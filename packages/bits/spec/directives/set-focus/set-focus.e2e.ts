import {
    browser,
    by,
    element,
    ElementFinder
} from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/public_api";
import { Helpers } from "../../helpers";

describe("USERCONTROL setFocus:", () => {
    let carrotRadio: ElementFinder;
    let onionRadio: ElementFinder;
    let carrotBtnAtom: ButtonAtom;
    let onionBtnAtom: ButtonAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("common/set-focus");
        carrotRadio = element(by.id("nui-demo-setfocus-radio-carrot")).element(by.tagName("input"));
        onionRadio = element(by.id("nui-demo-setfocus-radio-onion")).element(by.tagName("input"));
        carrotBtnAtom = Atom.find(ButtonAtom, "nui-demo-setfocus-button-carrot");
        onionBtnAtom = Atom.find(ButtonAtom, "nui-demo-setfocus-button-onion");
    });

    it("click button that handle a prop bound to the 'nuiSetFocus' changes focus", async () => {
        await expectIsNotSelected(carrotRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
    });

    it("if several component have 'nuiSetFocus' = true, focus gets the latest component", async () => {
        await expectIsNotSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await onionBtnAtom.click();
        await expectIsSelected(onionRadio);
        await expectIsNotSelected(carrotRadio);
    });

    async function expectIsSelected(finder: ElementFinder) {
        expect(await finder.equals(await browser.driver.switchTo().activeElement())).toEqual(true);
        await browser.driver.switchTo().defaultContent();
    }

    async function expectIsNotSelected(finder: ElementFinder) {
        expect(await finder.equals(await browser.driver.switchTo().activeElement())).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    }
});
