import { browser, by, element, ElementFinder } from "protractor";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { DateTimepickerAtom, DialogAtom } from "../public_api";

describe("a11y: date time picker", () => {
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
    });

    it("should verify a11y of date time picker", async () => {
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    // Enable once NUI-6031 is fixed
    xit("should verify a11y with opened time picker", async () => {
        await dateTimePickerBasic.getTimePicker().toggle();
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    // Enable once NUI-6031 is fixed
    xit("should verify a11y with opened date picker", async () => {
        await dateTimePickerBasic.getDatePicker().toggle();
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    describe("inside the dialog > ", () => {
        beforeEach(async () => {
            await dialogButtonElem.click();
            dateTimePickerDialog = Atom.find(
                DateTimepickerAtom,
                "nui-date-time-picker-dialog"
            );
        });

        afterEach(async () => {
            await DialogAtom.dismissDialog();
        });

        it("should verify a11y of the timepicker in modal dialog", async () => {
            await dateTimePickerDialog.getTimePicker().toggle();
            await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
        });

        it("should verify a11y of the datepicker in modal dialog", async () => {
            await dateTimePickerDialog.getDatePicker().toggle();
            await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
        });
    });
});
