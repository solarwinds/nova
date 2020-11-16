import {browser, by, element, ElementFinder} from "protractor";

import {Atom} from "../../atom";
import {Helpers} from "../../helpers";
import {
    ButtonAtom,
    CheckboxAtom,
    DatepickerAtom,
    DateTimepickerAtom,
    FormFieldAtom,
    RadioGroupAtom,
    SelectV2Atom,
    SwitchAtom,
    TextboxAtom,
    TextboxNumberAtom,
    TimepickerAtom
} from "../public_api";

describe("USERCONTROL form-field", () => {
    let atom: FormFieldAtom;
    let hintWithTemplate: FormFieldAtom;
    let atomWithTemplate: FormFieldAtom;
    let textbox: TextboxAtom;
    let textboxNumber: TextboxNumberAtom;
    let datepicker: DatepickerAtom;
    let toggleButton: ButtonAtom;
    let radioGroup: RadioGroupAtom;
    let select: SelectV2Atom;
    let switchElement: SwitchAtom;
    let timepicker: TimepickerAtom;
    let checkbox: CheckboxAtom;
    let dateTimepicker: DateTimepickerAtom;
    let dateTimepickerModelelement: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("form-field/form-field-test");
        atom = Atom.find(FormFieldAtom, "nui-demo-form-field");
        hintWithTemplate = Atom.find(FormFieldAtom, "nui-demo-form-field-hint-with-template");
        atomWithTemplate = Atom.find(FormFieldAtom, "nui-demo-form-field-with-template");
        textbox = Atom.find(TextboxAtom, "nui-form-field-test-textbox");
        textboxNumber = Atom.find(TextboxNumberAtom, "nui-form-field-test-textbox-number");
        datepicker = Atom.find(DatepickerAtom, "nui-form-field-test-datepicker");
        toggleButton = Atom.find(ButtonAtom, "nui-form-field-test-toggle-disable-state-button");
        radioGroup = Atom.find(RadioGroupAtom, "nui-form-field-test-radio");
        select = Atom.find(SelectV2Atom, "nui-form-field-test-select");
        switchElement = Atom.find(SwitchAtom, "nui-form-field-test-switch");
        timepicker = Atom.find(TimepickerAtom, "nui-form-field-test-timepicker");
        checkbox = Atom.find(CheckboxAtom, "nui-form-field-test-checkbox");
        dateTimepicker = Atom.find(DateTimepickerAtom, "nui-form-field-test-datetimepicker");
        dateTimepickerModelelement = element(by.id("nui-form-field-test-datetimepicker-model"));
    });

    it("should display caption", async () => {
        expect(await atom.getCaptionText()).toBe("This caption is generic for all form fields");
    });

    it("should display (opt) for optional fields near caption", async () => {
        expect(await atom.getStateText()).toBe("(optional)");
    });

    it("should display hint", async () => {
        expect(await atom.getHintText()).toBe("Hint may be useful");
    });

    it("should display hint template", async () => {
        expect(await hintWithTemplate.getHintText()).toBe("Hint template");
    });

    it("should display info icon", async () => {
        const iconAtom = atom.getInfoIcon();
        const iconName = iconAtom.getName();
        expect(iconName).toBe("severity_info");

        const iconPopover = atom.getInfoPopover();
        await iconPopover.openByHover();
        const popoverAppendedToBody = iconPopover.getPopoverBody();
        expect(await popoverAppendedToBody.getText()).toBe("Some info to show");

        // Clean-up: Un-hovering icon to hide popover
        await iconPopover.hover(undefined, { x: -1, y: -1 });
        await iconPopover.waitForClosed();
    });
    it("should display info from template", async () => {
        const iconAtom = atomWithTemplate.getInfoIcon();
        const iconName = await iconAtom.getName();
        expect(iconName).toBe("severity_info");

        const iconPopover = atomWithTemplate.getInfoPopover();
        await iconPopover.openByHover();
        const popoverAppendedToBody = iconPopover.getPopoverBody();
        expect(await popoverAppendedToBody.getText()).toBe("Template with link");

        // Clean-up: Un-hovering icon to hide popover
        await iconPopover.hover(undefined, { x: -1, y: -1 });
        await iconPopover.waitForClosed();
    });

    it("should display info icon with popover", async () => {
        const iconPopover = atom.getInfoPopover();
        await iconPopover.open();
        const popoverAppendedToBody = iconPopover.getPopoverBody();
        expect(await popoverAppendedToBody.getText()).toBe("Some info to show");

        // Clean-up: Un-hovering icon to hide popover
        await iconPopover.hover(undefined, { x: -1, y: -1 });
        await iconPopover.waitForClosed();
    });

    it("should set initial disabled state to the fields of form", async () => {
        expect(await textbox.disabled()).toBeTruthy();
        expect(await textboxNumber.isDisabled()).toBe(true);
        expect(await datepicker.isDisabled()).toBeTruthy();
        await datepicker.popup.getPopupToggle().click();
        expect(await datepicker.popup.isOpened()).toBeFalsy();
        expect(await radioGroup.getNumberOfDisabledItems()).toBe(1);
        expect(await select.isSelectDisabled()).toBeTruthy();
        expect(await switchElement.disabled()).toBeTruthy();
        expect(await timepicker.textbox.disabled()).toBeTruthy();
        await timepicker.popup.getPopupToggle().click();
        expect(await timepicker.popup.isOpened()).toBeFalsy();
        expect(await checkbox.isDisabled()).toBeTruthy();
        expect(await dateTimepicker.isDisabled()).toBeTruthy();
    });

    describe("disable state change", () => {
        beforeAll(async () => {
            await toggleButton.click();
        });

        it("should dynamically enable texbox", async () => {
            expect(await textbox.disabled()).toBeFalsy();
        });
        it("should dynamically enable texbox-number", async () => {
            expect(await textboxNumber.isDisabled()).toBe(false);
        });
        it("should dynamically enable datepicker", async () => {
            expect(await datepicker.isDisabled()).toBeFalsy();
            await datepicker.popup.getPopupToggle().click();
            expect(await datepicker.popup.isOpened()).toBeTruthy();
            await datepicker.popup.getPopupToggle().click();
        });
        it("should dynamically enable radioGroup", async () => {
            expect(await radioGroup.getNumberOfDisabledItems()).toBe(0);
        });
        it("should dynamically enable select", async () => {
            expect(await select.isSelectDisabled()).toBeFalsy();
        });
        it("should dynamically enable switch", async () => {
            expect(await switchElement.disabled()).toBeFalsy();
        });
        it("should dynamically enable timepicker", async () => {
            expect(await timepicker.textbox.disabled()).toBeFalsy();
            await timepicker.popup.getPopupToggle().click();
            expect(await timepicker.popup.isOpened()).toBeTruthy();
        });

        it("should dynamically enable checkbox", async () => {
            expect(await checkbox.isDisabled()).toBeFalsy();
        });

        it("should switch focus to textbox on icon click", async () => {
            await timepicker.icon.getElement().click();
            expect(await timepicker.textbox.input.getId())
                .toEqual(await (await browser.switchTo().activeElement()).getId());

            await timepicker.icon.getElement().click();
        });

        it("should change model for dateTimePicker", async () => {
            await dateTimepicker.getDatePicker().acceptText("01 Jan 2020");
            const timeToSelect = TimepickerAtom.createTimeString(2, 0);
            await dateTimepicker.getTimePicker().textbox.acceptText(timeToSelect);

            expect(dateTimepickerModelelement.getText()).toBe("Wednesday, January 1, 2020 2:00 AM");
        });

        it("should disable all components back", async () => {
            await toggleButton.click();

            expect(await textbox.disabled()).toBeTruthy();
            expect(await textboxNumber.isDisabled()).toBe(true);
            expect(await datepicker.isDisabled()).toBeTruthy();
            await datepicker.popup.getPopupToggle().click();
            expect(await datepicker.popup.isOpened()).toBeFalsy();
            expect(await radioGroup.getNumberOfDisabledItems()).toBe(1);
            expect(await select.isSelectDisabled()).toBeTruthy();
            expect(await switchElement.disabled()).toBeTruthy();
            expect(await timepicker.textbox.disabled()).toBeTruthy();
            await timepicker.popup.getPopupToggle().click();
            expect(await timepicker.popup.isOpened()).toBeFalsy();
            expect(await checkbox.isDisabled()).toBeTruthy();
            expect(await dateTimepicker.isDisabled()).toBeTruthy();
        });
    });
});
