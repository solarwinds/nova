import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { DateTimepickerAtom } from "./datetimepicker.atom";

describe("Visual tests: Date-time-picker", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dialogButtonElem: ElementFinder;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("date-time-picker/date-time-picker-visual-test");
        dateTimePickerBasic = Atom.find(DateTimepickerAtom, "nui-basic-date-time-picker");
        dateTimePickerRanged = Atom.find(DateTimepickerAtom, "nui-date-time-picker-ranged");
        dialogButtonElem = element(by.id("nui-visual-test-dialog-btn"));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });
    it("Default look", async () => {
        await eyes.open(browser, "NUI", "DateTimePicker");
        await eyes.checkWindow("Default");

        await dateTimePickerBasic.getTimePicker().toggle();
        await dateTimePickerRanged.getDatePicker().hover();
        await eyes.checkWindow("Focus time-picker, hover date-picker");
        await dateTimePickerBasic.getDatePicker().toggle();
        await dateTimePickerRanged.getTimePicker().hover();
        await eyes.checkWindow("Hover time-picker, focus date-picker");

        await dateTimePickerRanged.getDatePicker().toggle();
        await eyes.checkWindow("Ranged picker disables dates out of range");

        await dialogButtonElem.click();
        dateTimePickerDialog = Atom.find(DateTimepickerAtom, "nui-date-time-picker-dialog");

        await dateTimePickerDialog.getDatePicker().toggle();
        await eyes.checkWindow("Date Time Picker Dialog Date");
        await dateTimePickerDialog.getTimePicker().toggle();
        await eyes.checkWindow("Date Time Picker Dialog Time");

        await Helpers.switchDarkTheme("on");
        await dateTimePickerDialog.getDatePicker().toggle();
        await eyes.checkWindow("Dark theme - Date Time Picker Dialog Date");
        await dateTimePickerDialog.getTimePicker().toggle();
        await eyes.checkWindow("Dark theme - Date Time Picker Dialog Time");

        await eyes.close();
    }, 200000);
});
