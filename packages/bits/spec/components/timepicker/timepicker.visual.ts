import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

describe("Visual tests: Timepicker", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicTimepicker: TimepickerAtom;
    let customFormatTimepicker: TimepickerAtom;
    let customStepTimepicker: TimepickerAtom;
    let requiredTimepicker: TimepickerAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("time-picker/time-picker-visual-test");
        basicTimepicker = Atom.find(TimepickerAtom, "nui-visual-test-timepicker-basic");
        customFormatTimepicker = Atom.find(TimepickerAtom, "nui-visual-test-custom-format-timepicker");
        customStepTimepicker = Atom.find(TimepickerAtom, "nui-visual-test-custom-step-timepicker");
        requiredTimepicker = Atom.find(TimepickerAtom, "nui-visual-test-required-timepicker");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Timepicker");
        await eyes.checkWindow("Default");

        await customStepTimepicker.toggle();
        await basicTimepicker.textbox.hover();
        await eyes.checkWindow("Timepicker with custom step is toggled and Basic Timepicker is hovered");

        await customFormatTimepicker.toggle();
        await eyes.checkWindow("Timepicker with custom format is toggled");

        await customFormatTimepicker.toggle();
        await requiredTimepicker.toggle();
        await eyes.checkWindow("Timepicker with validation is toggled");

        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.clickItemByText("2");
        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.hover(basicTimepicker.menuPopup.getSelectedItem());
        await eyes.checkWindow("Selected menuitem in Basic Timepicker is focused");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicTimepicker.menuPopup.hover(basicTimepicker.menuPopup.getItemByIndex(2));
        await eyes.checkWindow("Unelected menuitem in Basic Timepicker is focused");

        await eyes.close();
    }, 200000);
});
