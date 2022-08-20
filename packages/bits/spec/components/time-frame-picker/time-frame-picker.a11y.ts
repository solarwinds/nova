import { browser } from "protractor";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { TimeFramePickerAtom, PopoverAtom } from "../public_api";

describe("a11y: time-frame-picker", () => {
    let rulesToDisable: string[] = [];
    let popoverWithTimeframePicker: PopoverAtom;
    let popoverWithDatePicker: PopoverAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "time-frame-picker/time-frame-picker-visual-test"
        );

        popoverWithTimeframePicker = Atom.find(
            PopoverAtom,
            "nui-demo-visual-default-popover"
        );
        popoverWithDatePicker = Atom.find(
            PopoverAtom,
            "nui-demo-visual-datepicker-popover"
        );
    });

    it("should check a11y of time-frame-picker", async () => {
        await popoverWithTimeframePicker.open();
        await assertA11y(
            browser,
            TimeFramePickerAtom.CSS_CLASS,
            rulesToDisable
        );
    });

    it("should check a11y of time-frame-picker  with date picker", async () => {
        await popoverWithDatePicker.open();
        await assertA11y(
            browser,
            TimeFramePickerAtom.CSS_CLASS,
            rulesToDisable
        );
    });
});
