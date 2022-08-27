import { browser } from "protractor";

import { assertA11y, Helpers } from "../../../helpers";
import { TimeFrameBarAtom } from "../../public_api";

describe("a11y: time frame bar", () => {
    beforeAll(async () => {
        await Helpers.prepareBrowser("convenience/time-frame-bar/visual");
    });

    it("should verify a11y of time frame bar", async () => {
        await assertA11y(browser, TimeFrameBarAtom.CSS_CLASS);
    });
});
