import { browser, by, element, ElementFinder, Key } from "protractor";

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { ComboboxV2Atom } from "../public_api";

describe("a11y: combobox-v2", () => {
    const rulesToDisable: string[] = ["aria-required-children"];

    let comboboxBasic: ComboboxV2Atom;
    let comboboxError: ComboboxV2Atom;
    let comboboxForm: ComboboxV2Atom;
    let comboboxSingle: ComboboxV2Atom;
    let comboboxMulti: ComboboxV2Atom;
    let comboboxCustomControl: ComboboxV2Atom;
    let comboboxValueRemoval: ComboboxV2Atom;

    let disableButton: ElementFinder;
    let toggleButton: ElementFinder;

    let focusdrop: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("combobox-v2/test");

        comboboxBasic = Atom.find(ComboboxV2Atom, "basic");
        comboboxError = Atom.find(ComboboxV2Atom, "error");
        comboboxForm = Atom.find(ComboboxV2Atom, "form");
        comboboxSingle = Atom.find(ComboboxV2Atom, "single");
        comboboxMulti = Atom.find(ComboboxV2Atom, "multi");
        comboboxCustomControl = Atom.find(ComboboxV2Atom, "custom-control");
        comboboxValueRemoval = Atom.find(ComboboxV2Atom, "removal");

        disableButton = element(by.id("trigger-disabled"));
        toggleButton = element(by.id("toggle"));
        focusdrop = element(by.className("focus-drop"));
    });

    it("should verify a11y of combobox-v2", async () => {
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);

        await (await comboboxError.getFirstOption()).click();
        await comboboxError.removeAll();
        await (await comboboxForm.getLastOption()).click();
        await comboboxForm.removeAll();
        await Helpers.pressKey(Key.TAB);
        await ComboboxV2Atom.type("Item 3");
        await (await comboboxBasic.getOption(33)).hover();
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);

        Helpers.switchDarkTheme("on");
        await (await comboboxBasic.getOption(33)).click();
        await (await comboboxError.getFirstOption()).click();
        await (await comboboxForm.getLastOption()).click();
        await disableButton.click();
        await comboboxMulti.selectAll();
        await comboboxSingle.type("qwerty");
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);

        Helpers.switchDarkTheme("off");
        await comboboxSingle.type("qwerty");
        await comboboxSingle.createOption.click();
        await comboboxMulti.type("qwerty");
        await comboboxMulti.createOption.click();
        await comboboxSingle.getElement().click();
        await Helpers.pressKey(Key.ARROW_UP);
        await Helpers.pressKey(Key.DOWN);
        await (await comboboxSingle.getLastOption()).hover();
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);

        await Helpers.pressKey(Key.TAB);
        await comboboxValueRemoval.hover();
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);

        await focusdrop.click();
        await toggleButton.click();
        await comboboxCustomControl.selectFirst(24);
        await comboboxCustomControl.removeChips(1);
        await assertA11y(browser, ComboboxV2Atom.CSS_CLASS, rulesToDisable);
    }, 100000);
});
