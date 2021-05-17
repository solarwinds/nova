import { by, element } from "protractor";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom, CheckboxGroupAtom } from "../public_api";
import { ButtonAtom } from "../public_api";

describe("USERCONTROL Checkbox Group", () => {
    let checkboxGroup: CheckboxGroupAtom;
    let checkboxGroupJustified: CheckboxGroupAtom;
    let checkbox1: CheckboxAtom | undefined;
    let checkbox2: CheckboxAtom | undefined;
    let checkbox3: CheckboxAtom | undefined;
    let checkbox4: CheckboxAtom | undefined;
    let checkboxGroupCheckboxDisabled: CheckboxAtom;
    let checkboxGroupPartOfForm: CheckboxGroupAtom;
    let submitBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-test");
        checkboxGroup = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-basic");
        checkboxGroupJustified = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-justified");
        checkboxGroupCheckboxDisabled = Atom.find(CheckboxAtom, "nui-demo-checkbox-group-1-disabled-checkbox");
        checkboxGroupPartOfForm = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-part-of-form");
        submitBtn = Atom.findIn(ButtonAtom, element(by.buttonText("Submit")));
        checkbox1 = await checkboxGroup.getCheckbox("Cabbage");
        checkbox2 = await checkboxGroup.getCheckbox("Potato");
        checkbox3 = await checkboxGroup.getCheckbox("Tomato");
        checkbox4 = await checkboxGroup.getCheckbox("Carrot");
    });

    it("checking works in a pre-checked group", async () => {
        expect(await checkbox1?.isChecked()).toBe(false);
        expect(await checkbox2?.isChecked()).toBe(true);

        expect(await checkbox3?.isChecked()).toBe(true);
        expect(await checkbox4?.isChecked()).toBe(false);
        await checkbox3?.toggle();
        expect(await checkbox3?.isChecked()).toBe(false);
    });

    it("nui-checkbox should have width value, equal to the width of the checkbox-group", async () => {
        const component = checkboxGroupJustified.getFirst().getElement();
        const parentElement = checkboxGroupJustified.getElement();
        const componentWidth = (await component.getSize()).width;
        const containerWidth = (await parentElement.getSize()).width;
        expect(componentWidth).toEqual(containerWidth);
    });

    it("should not change the value if clicked on disabled checkbox inside the checkbox group", async () => {
        await checkboxGroupCheckboxDisabled.toggle();
        expect(await checkboxGroupCheckboxDisabled.isChecked()).toBe(true);
    });

    it("should activate submit button when 3 checkboxes selected", async () => {
        expect(await checkboxGroupPartOfForm.getCheckboxByIndex(0).isChecked()).toBe(true);
        expect(await checkboxGroupPartOfForm.getCheckboxByIndex(1).isChecked()).toBe(true);
        expect(await checkboxGroupPartOfForm.getCheckboxByIndex(2).isChecked()).toBe(false);
        expect(await submitBtn.isDisabled()).toBe(true);
        await checkboxGroupPartOfForm.getCheckboxByIndex(2).toggle();
        expect(await submitBtn.isDisabled()).toBe(false);
    })
});
