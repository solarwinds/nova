import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { PopoverAtom } from "../../components/popover/popover.atom";
import { TimepickerAtom } from "../../components/timepicker/timepicker.atom";
import { Animations, Helpers } from "../../helpers";

import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";

describe("USERCONTROL time-frame-picker", () => {
    const basicTimeFramePickerPopover: PopoverAtom = Atom.find(PopoverAtom, "nui-demo-basic-time-frame-picker");
    const basicQuickPicker: QuickPickerAtom = Atom.findIn(QuickPickerAtom, basicTimeFramePickerPopover.getPopoverBody());
    const basicTimeFramePicker: TimeFramePickerAtom = Atom.findIn(TimeFramePickerAtom, basicTimeFramePickerPopover.getPopoverBody());
    const basicTimeFramePickerCancelButton: ButtonAtom = Atom.find(ButtonAtom, "nui-demo-basic-time-frame-picker-cancel");
    const basicTimeFramePickerUseButton: ButtonAtom = Atom.find(ButtonAtom, "nui-demo-basic-time-frame-picker-use");

    beforeEach(async () => {
        await Helpers.prepareBrowser("time-frame-picker/time-frame-picker-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    describe(" basic with date limitations>", () => {
        beforeEach(async () => {
            await basicTimeFramePickerPopover.open();
        });

        it("should not have Use button before any control value is changed", async () => {
            expect(await basicTimeFramePickerUseButton.isPresent()).toBeFalsy();
        });

        it("should have an ability to change all control values", async () => {
            const startTFP = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker1 = startTFP.getDatePicker();
            await datePicker1.clearText();
            await datePicker1.acceptText("04/08/2018");
            const timePicker1 = startTFP.getTimePicker();
            await timePicker1.textbox.clearText();
            await timePicker1.textbox.acceptText(TimepickerAtom.createTimeString(6, 0));
            const endTFP = basicTimeFramePicker.getEndDatetimePicker();
            const datePicker2 = endTFP.getDatePicker();
            await datePicker2.clearText();
            await datePicker2.acceptText("04/09/2018");
            const timePicker2 = endTFP.getTimePicker();
            await timePicker2.textbox.clearText();
            await timePicker2.textbox.acceptText(TimepickerAtom.createTimeString(6, 0));
            await basicTimeFramePickerUseButton.click();
            expect(await basicTimeFramePickerPopover.getElement().getText()).toEqual("April 8, 2018 6:00 AM - April 9, 2018 6:00 AM");
        }, 20000);

        it("should not change all control values after Cancel is clicked", async () => {
            const startTFP = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker1 = startTFP.getDatePicker();
            await datePicker1.clearText();
            await datePicker1.acceptText("04/09/2018");
            const timePicker1 = startTFP.getTimePicker();
            await timePicker1.textbox.clearText();
            await timePicker1.textbox.acceptText(TimepickerAtom.createTimeString(6, 0));
            const endTFP = basicTimeFramePicker.getEndDatetimePicker();

            const datePicker2 = endTFP.getDatePicker();
            await datePicker2.clearText();
            await datePicker2.acceptText("04/10/2018");
            const timePicker2 = endTFP.getTimePicker();
            await timePicker2.textbox.clearText();
            await timePicker2.textbox.acceptText(TimepickerAtom.createTimeString(6, 0));

            await basicTimeFramePickerCancelButton.click();
            expect(await basicTimeFramePickerPopover.getElement().getText()).toEqual("Last hour");
        });
        it("should select quick pick and detect selected quick pick", async () => {
            expect(await basicQuickPicker.getSelectedPreset()).toEqual("Last hour");
            await basicQuickPicker.selectPresetByTitle("Last 12 hours");
            expect(await basicTimeFramePickerPopover.getElement().getText()).toEqual("Last 12 hours");
        });
        it("should not be able to select time before min time", async () => {
            const startDateTimePicker = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker = startDateTimePicker.getDatePicker();
            await datePicker.clearText();
            await datePicker.acceptText("04/11/2018");
            await datePicker.toggle();
            await datePicker.goBack();
            let clickable = true;
            try {
                await datePicker.selectDate(1);
            } catch (e) {
                clickable = false;
            }

            expect(clickable).toEqual(false);
            expect(await datePicker.getInputValue()).toEqual("11 Apr 2018");
        });
        it("should not be able to select any date in the next month if MaxDate is now", async () => {
            const startDateTimePicker = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker = startDateTimePicker.getDatePicker();
            await datePicker.toggle();
            await datePicker.clickTodayButton();
            const expectedDate = await datePicker.getInputValue();
            await datePicker.toggle();
            await datePicker.goNext();
            let clickable = true;
            try {
                await datePicker.selectDate(1);
            } catch (e) {
                clickable = false;
            }

            expect(clickable).toEqual(false);
            expect(await datePicker.getInputValue()).toEqual(expectedDate);
        });
    });
});
