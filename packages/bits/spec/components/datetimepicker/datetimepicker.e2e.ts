import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { DateTimepickerAtom } from "./datetimepicker.atom";

describe("USERCONTROL date-time-picker", () => {
    let dateTimePicker: DateTimepickerAtom;

    const getModelValue = async (): Promise<string> => browser.element(by.id("model-value")).getText();

    beforeEach(async () => {
        await Helpers.prepareBrowser("date-time-picker/date-time-picker-test");
        dateTimePicker = Atom.find(DateTimepickerAtom, "nui-demo-date-time-picker");
    });

    describe("when the datetime picker is displayed, it", () => {
        it("contains initial value", async () => {
            expect(await dateTimePicker.getDatePicker().getInput().getAttribute("value")).toEqual("15 Mar 1970");
            expect(await dateTimePicker.getTimePicker().textbox.getValue()).toEqual("3:30 PM");
        });
    });

    describe("when a valid date is entered and ESC is pressed, it", () => {
        it("propagates the value to model", async () => {
            await dateTimePicker.getDatePicker().clearText();
            await dateTimePicker.getDatePicker().acceptText("5/28/1984");
            expect(await getModelValue()).toBe("1984-05-28 15:30");
        });
    });
    // TODO: enable in scope of NUI-1935
    describe("when a valid time is entered, it", () => {
        xit("propagates the value to model", async () => {
            await dateTimePicker.getTimePicker().textbox.clearText();
            await dateTimePicker.getTimePicker().textbox.acceptText("9:00 am");
            expect(await getModelValue()).toBe("1970-03-15 09:00");
        });
    });
    // TODO: enable in scope of NUI-1934
    describe("when a invalid date is entered and ESC is pressed, it", () => {
        xit("clears the model", async () => {
            await dateTimePicker.getDatePicker().clearText();
            await dateTimePicker.getDatePicker().acceptText("bs bs bs");
            expect(await getModelValue()).toBe("");
        });
    });
    // TODO: enable after NUI-1934 is closed
    describe("when a invalid time is entered, it", () => {
        xit("clears the model", async () => {
            await dateTimePicker.getTimePicker().textbox.clearText();
            await dateTimePicker.getTimePicker().textbox.acceptText("bs bs bs");
            expect(await getModelValue()).toBe("");
        });
    });
});
