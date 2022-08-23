import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { DateTimepickerAtom } from "./datetimepicker.atom";

const name: string = "Date-time-picker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dialogButtonElem: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "date-time-picker/date-time-picker-visual-test"
        );
        dateTimePickerBasic = Atom.find(
            DateTimepickerAtom,
            "nui-basic-date-time-picker"
        );
        dateTimePickerRanged = Atom.find(
            DateTimepickerAtom,
            "nui-date-time-picker-ranged"
        );
        dialogButtonElem = element(by.id("nui-visual-test-dialog-btn"));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await dateTimePickerBasic.getTimePicker().toggle();
        await dateTimePickerRanged.getDatePicker().hover();
        await camera.say.cheese(`Focus time-picker, hover date-picker`);
        await dateTimePickerBasic.getDatePicker().toggle();
        await dateTimePickerRanged.getTimePicker().hover();
        await camera.say.cheese(`Hover time-picker, focus date-picker`);

        await dateTimePickerRanged.getDatePicker().toggle();
        await camera.say.cheese(`Ranged picker disables dates out of range`);

        await dialogButtonElem.click();
        dateTimePickerDialog = Atom.find(
            DateTimepickerAtom,
            "nui-date-time-picker-dialog"
        );

        await dateTimePickerDialog.getDatePicker().toggle();
        await camera.say.cheese(`Date Time Picker Dialog Date`);
        await dateTimePickerDialog.getTimePicker().toggle();
        await camera.say.cheese(`Date Time Picker Dialog Time`);

        await Helpers.switchDarkTheme("on");
        await dateTimePickerDialog.getDatePicker().toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Date`);
        await dateTimePickerDialog.getTimePicker().toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Time`);

        await camera.turn.off();
    }, 200000);
});
