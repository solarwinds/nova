import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom, CheckboxGroupAtom } from "../public_api";

describe("USERCONTROL Checkbox Group", () => {
    let checkboxGroup: CheckboxGroupAtom;
    let checkboxGroupJustified: CheckboxGroupAtom;
    let checkboxGroupInForm: CheckboxGroupAtom;
    let checkboxGroupInFormWithDisabledItems: CheckboxGroupAtom;
    let checkbox1: CheckboxAtom | undefined;
    let checkbox2: CheckboxAtom | undefined;
    let checkbox3: CheckboxAtom | undefined;
    let checkbox4: CheckboxAtom | undefined;
    let checkboxGroupCheckboxDisabled: CheckboxAtom;

    beforeAll(async () => {
        checkboxGroup = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-basic");
        checkboxGroupJustified = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-justified");
        checkboxGroupInForm = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-in-form");
        checkboxGroupInFormWithDisabledItems = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-in-form-disabled-checkboxes");
        checkboxGroupCheckboxDisabled = Atom.find(CheckboxAtom , "nui-demo-checkbox-group-1-disabled-checkbox");
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-test");
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

    it("should disable checkboxes on init if form is disabled", async () => {
        const checkboxes = await Atom.findCount(CheckboxAtom, checkboxGroupInForm.getElement());
        for (let i = 0; i < checkboxes; i++) {
            expect(await checkboxGroupInForm.getCheckboxByIndex(i).isDisabled()).toBe(true);
        }
    });

    it("should be able to have a disabled checkbox within the checkbox group", async () => {
        expect(await checkboxGroupCheckboxDisabled.isDisabled()).toBe(true);
    });

    it("should be able to have a disabled checkbox within the checkbox group inside reactive form", async () => {
        expect(await checkboxGroupInFormWithDisabledItems.getCheckboxByIndex(0).isDisabled()).toBe(true);
        expect(await checkboxGroupInFormWithDisabledItems.getCheckboxByIndex(2).isDisabled()).toBe(true);
    });

    it("should not change the value if clicked on disabled checkbox inside the checkbox group", async () => {
        await checkboxGroupCheckboxDisabled.toggle();

        expect(await checkboxGroupCheckboxDisabled.isChecked()).toBe(true);
    });
});
