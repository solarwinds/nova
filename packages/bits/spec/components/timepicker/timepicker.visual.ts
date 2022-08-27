import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

const name: string = "Timepicker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTimepicker: TimepickerAtom;
    let customFormatTimepicker: TimepickerAtom;
    let customStepTimepicker: TimepickerAtom;
    let requiredTimepicker: TimepickerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("time-picker/time-picker-visual-test");
        basicTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-timepicker-basic"
        );
        customFormatTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-custom-format-timepicker"
        );
        customStepTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-custom-step-timepicker"
        );
        requiredTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-required-timepicker"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await customStepTimepicker.toggle();
        await basicTimepicker.textbox.hover();
        await camera.say.cheese(
            "Timepicker with custom step is toggled and Basic Timepicker is hovered"
        );

        await customFormatTimepicker.toggle();
        await camera.say.cheese("Timepicker with custom format is toggled");

        await customFormatTimepicker.toggle();
        await requiredTimepicker.toggle();
        await camera.say.cheese("Timepicker with validation is toggled");

        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.clickItemByText("2");
        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.hover(
            basicTimepicker.menuPopup.getSelectedItem()
        );
        await camera.say.cheese(
            "Selected menuitem in Basic Timepicker is focused"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicTimepicker.menuPopup.hover(
            basicTimepicker.menuPopup.getItemByIndex(2)
        );
        await camera.say.cheese(
            "Unelected menuitem in Basic Timepicker is focused"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme with focus`);

        await camera.turn.off();
    }, 200000);
});
