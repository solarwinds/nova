import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { DatepickerAtom } from "./datepicker.atom";

const name: string = "DatePicker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let datepickerBasic: DatepickerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("date-picker/date-picker-visual-test");
        datepickerBasic = Atom.find(DatepickerAtom, "nui-basic-usage-datepicker");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await datepickerBasic.hover();
        await camera.say.cheese(`Hover state`);

        await datepickerBasic.toggle();
        await datepickerBasic.hover(datepickerBasic.getActiveDay());
        await camera.say.cheese(`Opened state`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
