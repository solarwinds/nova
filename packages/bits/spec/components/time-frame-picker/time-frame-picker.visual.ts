import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { DatepickerAtom } from "../datepicker/datepicker.atom";
import { PopoverAtom } from "../popover/popover.atom";

import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";

describe("Visual tests: Timeframe Picker", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let popoverWithTimeframePicker: PopoverAtom;
    let popoverWithDatePicker: PopoverAtom;
    let popoverComplex: PopoverAtom;
    let quickpickerWithTimeramePicker: QuickPickerAtom;
    let timeFramePicker: TimeFramePickerAtom;
    let datePicker: DatepickerAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("time-frame-picker/time-frame-picker-visual-test");

        popoverWithTimeframePicker = Atom.find(PopoverAtom, "nui-demo-visual-default-popover");
        popoverWithDatePicker = Atom.find(PopoverAtom, "nui-demo-visual-datepicker-popover");
        popoverComplex = Atom.find(PopoverAtom, "nui-demo-visual-complex-popover");
        quickpickerWithTimeramePicker = Atom.findIn(QuickPickerAtom, popoverWithTimeframePicker.getPopoverBody());
        timeFramePicker = Atom.findIn(TimeFramePickerAtom, popoverWithTimeframePicker.getPopoverBody());
        datePicker = Atom.findIn(DatepickerAtom, popoverWithDatePicker.getPopoverBody());
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Timeframe Picker");

        await popoverWithTimeframePicker.open();
        await quickpickerWithTimeramePicker.hoverPresetByTitle("Last 24 hours");
        await eyes.checkWindow("Default time frame picker view");

        await timeFramePicker.getStartDatetimePicker().getDatePicker().clickCalendarIcon();
        await eyes.checkWindow("With date picker opened");

        await timeFramePicker.getStartDatetimePicker().getDatePicker().clickCalendarIcon();
        await timeFramePicker.getEndDatetimePicker().getTimePicker().icon.getElement().click();
        await eyes.checkWindow("With time picker opened");

        await timeFramePicker.getEndDatetimePicker().getTimePicker().menuPopup.clickItemByText("1:00 AM");
        await eyes.checkWindow("Checking the confirmation buttons alignment and styling");

        await popoverWithTimeframePicker.togglePopover();

        await popoverWithDatePicker.open();
        await eyes.checkWindow("Default quickpicker with datepicker");

        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("on");
        await popoverWithDatePicker.open();
        await eyes.checkWindow("Dark theme");
        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("off");

        await popoverComplex.open();
        await eyes.checkWindow("Complex popover with timeframepicker and datepicker");

        await eyes.close();
    }, 200000);
});
