import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { DatepickerAtom } from "../datepicker/datepicker.atom";
import { PopoverAtom } from "../popover/popover.atom";

import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";

const name: string = "Timeframe Picker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let popoverWithTimeframePicker: PopoverAtom;
    let popoverWithDatePicker: PopoverAtom;
    let popoverComplex: PopoverAtom;
    let quickpickerWithTimeramePicker: QuickPickerAtom;
    let timeFramePicker: TimeFramePickerAtom;
    let datePicker: DatepickerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("time-frame-picker/time-frame-picker-visual-test");

        popoverWithTimeframePicker = Atom.find(PopoverAtom, "nui-demo-visual-default-popover");
        popoverWithDatePicker = Atom.find(PopoverAtom, "nui-demo-visual-datepicker-popover");
        popoverComplex = Atom.find(PopoverAtom, "nui-demo-visual-complex-popover");
        quickpickerWithTimeramePicker = Atom.findIn(QuickPickerAtom, popoverWithTimeframePicker.getPopoverBody());
        timeFramePicker = Atom.findIn(TimeFramePickerAtom, popoverWithTimeframePicker.getPopoverBody());
        datePicker = Atom.findIn(DatepickerAtom, popoverWithDatePicker.getPopoverBody());
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await popoverWithTimeframePicker.open();
        await quickpickerWithTimeramePicker.hoverPresetByTitle("Last 24 hours");
        await camera.say.cheese("Default time frame picker view");

        await timeFramePicker.getStartDatetimePicker().getDatePicker().toggle();
        await camera.say.cheese("With date picker opened");

        await timeFramePicker.getStartDatetimePicker().getDatePicker().toggle();
        await timeFramePicker.getEndDatetimePicker().getTimePicker().icon.getElement().click();
        await camera.say.cheese("With time picker opened");

        await timeFramePicker.getEndDatetimePicker().getTimePicker().menuPopup.clickItemByText("1:00 AM");
        await camera.say.cheese("Checking the confirmation buttons alignment and styling");

        await popoverWithTimeframePicker.togglePopover();

        await popoverWithDatePicker.open();
        await camera.say.cheese("Default quickpicker with datepicker");

        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("on");
        await popoverWithDatePicker.open();
        await camera.say.cheese("Dark theme");
        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("off");

        await popoverComplex.open();
        await camera.say.cheese("Complex popover with timeframepicker and datepicker");

        await camera.turn.off();
    }, 200000);
});
