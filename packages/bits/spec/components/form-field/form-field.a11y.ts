import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import {
    ButtonAtom,
    CheckboxAtom,
    CheckboxGroupAtom,
    ComboboxV2Atom,
    DatepickerAtom,
    DateTimepickerAtom,
    RadioGroupAtom,
    SelectV2Atom,
    SwitchAtom,
    TextboxAtom,
    TextboxNumberAtom,
    TimepickerAtom
} from "../public_api";
const axeBuilder = require("axe-webdriverjs");

describe("a11y: form-field", () => {
    let toggleButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("form-field/form-field-test");
        toggleButton = Atom.find(ButtonAtom, "nui-form-field-test-toggle-disable-state-button");
        await toggleButton.click();
    });

    it("button", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${ButtonAtom.CSS_CLASS}`).disableRules("color-contrast").analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("textbox", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${TextboxAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("textboxNumber", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${TextboxNumberAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("switch", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${SwitchAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("radio-group", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${RadioGroupAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("checkbox", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${CheckboxAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("checkbox group", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${CheckboxGroupAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("datepicker", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${DatepickerAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("timepicker", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${TimepickerAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("datetimepicker", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${DateTimepickerAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("select", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${SelectV2Atom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("combobox", async () => {
        const accessibilityScanResults = await axeBuilder(browser.driver).include(`.${ComboboxV2Atom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
