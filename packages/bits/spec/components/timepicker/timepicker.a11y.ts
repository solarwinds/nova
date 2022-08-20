import { browser } from "protractor";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { TimepickerAtom } from "../public_api";

describe("a11y: timepicker", () => {
    let rulesToDisable: string[] = [
        "scrollable-region-focusable", // NUI-6001
    ];
    let basicTimepicker: TimepickerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("time-picker/time-picker-visual-test");

        basicTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-timepicker-basic"
        );
    });

    it("should check a11y of timepicker", async () => {
        await basicTimepicker.toggle();
        await assertA11y(browser, TimepickerAtom.CSS_CLASS, rulesToDisable);
    });
});
