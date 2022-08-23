import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { DatepickerAtom } from "../public_api";

// Disabled until NUI-6014 is fixed
xdescribe("a11y: datepicker", () => {
    beforeAll(async () => {
        await Helpers.prepareBrowser("date-picker/date-picker-visual-test");
    });

    it("should verify a11y of datepicker", async () => {
        await assertA11y(browser, DatepickerAtom.CSS_CLASS);
    });
});
