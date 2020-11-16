import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { RadioGroupAtom } from "../public_api";

describe("USERCONTROL Radio group", () => {
    let fruitGroup: RadioGroupAtom;
    let fruitGroupInline: RadioGroupAtom;
    let vegetableGroup: RadioGroupAtom;
    let colorGroup: RadioGroupAtom;
    let disabledGroup: RadioGroupAtom;
    let toggleDisabledGroupCheckbox: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("radio-group/radio-group-test");
        fruitGroup = Atom.find(RadioGroupAtom, "fruit-radio-group");
        fruitGroupInline = Atom.find(RadioGroupAtom, "fruit-radio-group-inline");
        vegetableGroup = Atom.find(RadioGroupAtom, "vegetable-radio-group");
        colorGroup = Atom.find(RadioGroupAtom, "color-radio-group");
        disabledGroup = Atom.find(RadioGroupAtom, "disabled-radio-group");
        toggleDisabledGroupCheckbox = Atom.find(CheckboxAtom, "toggle-disabled-group-checkbox");
    });

    it("should have 'Orange' fruit checked by default and Banana is disabled", async () => {
        expect(await fruitGroup.getNumberOfDisabledItems()).toBe(1);
        expect(await fruitGroup.getValue()).toEqual("Orange");
    });

    it("should have only one item selected", async () => {
        expect(await fruitGroup.isRadioSelected("Banana")).toBe(false);
        expect(await fruitGroup.isRadioSelected("Kiwi")).toBe(false);
        expect(await fruitGroup.isRadioSelected("Orange")).toBe(true);
        expect(await fruitGroup.isRadioSelected("Papaya")).toBe(false);
    });

    it("should have 'Kiwi' fruit value", async () => {
        await fruitGroup.getRadioByValue("Kiwi").click();
        expect(await fruitGroup.getValue()).toEqual("Kiwi");
    });

    it("radio buttons should be displayed inline", async () => {
        expect(await fruitGroupInline.getElement().getCssValue("display")).toEqual("inline-flex");
    });

    it("should not be allowed to select if disabled", async () => {
        const bananaRadioInput = fruitGroup.getRadioInputByValue("Banana");
        const bananaRadioLabel = fruitGroup.getRadioByValue("Banana");
        const papayaRadioLabel = fruitGroup.getRadioByValue("Papaya");
        expect(await bananaRadioInput.isEnabled()).toBe(false);
        await papayaRadioLabel.click();
        await bananaRadioLabel.click();
        expect(await fruitGroup.getValue()).not.toEqual("Banana");
        expect(await fruitGroup.getValue()).toEqual("Papaya");
        expect(await fruitGroup.isRadioSelected("Papaya")).toBe(true);
    });

    it("should set default value with form control", async () => {
        expect(await vegetableGroup.getValue()).toEqual("Potato");
    });

    it("should disable all buttons with form control", async () => {
        const total = await disabledGroup.getNumberOfItems();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(total);
    });

    it("should initialize a disabled state and be able to handle dynamic disabled state change", async () => {
        const total = await disabledGroup.getNumberOfItems();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(total);
        await toggleDisabledGroupCheckbox.toggle();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(0);
        await toggleDisabledGroupCheckbox.toggle();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(total);
    });

    it("should have correct help hint text", async () => {
        expect(await colorGroup.getHelpHintText(0)).toEqual("hot color");
        expect(await colorGroup.getHelpHintText(1)).toEqual("color of nature");
        expect(await colorGroup.getHelpHintText(2)).toEqual("color of sky");
    });

    it("should have correct number of items", async () => {
        expect(await fruitGroup.getNumberOfItems()).toEqual(4);
        expect(await colorGroup.getNumberOfItems()).toEqual(3);
    });
});
