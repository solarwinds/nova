import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { DatepickerAtom } from "./datepicker.atom";

describe("Visual tests: DatePicker", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let datepickerBasic: DatepickerAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("date-picker/date-picker-visual-test");

        datepickerBasic = Atom.find(DatepickerAtom, "nui-basic-usage-datepicker");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "DatePicker");
        await eyes.checkWindow("Default");

        await datepickerBasic.hover();
        await eyes.checkWindow("Hover state");

        await datepickerBasic.clickCalendarIcon();
        await datepickerBasic.hover(datepickerBasic.getActiveDay());
        await eyes.checkWindow("Opened state");

        await eyes.close();
    }, 100000);
});
