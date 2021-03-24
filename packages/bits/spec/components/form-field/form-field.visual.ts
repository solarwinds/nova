import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { CheckboxGroupAtom } from "../checkbox-group/checkbox-group.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { ComboboxAtom } from "../combobox/combobox.atom";
import { RadioGroupAtom } from "../radio-group/radio-group.atom";
import { SelectAtom } from "../select/select.atom";
import { SwitchAtom } from "../switch/switch.atom";
import { TextboxAtom } from "../textbox/textbox.atom";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

const name: string = "Form Field";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let textbox: TextboxAtom;
    let nickname: TextboxAtom;
    let city: TextboxAtom;
    let checkbox: CheckboxAtom;
    let switchElement: SwitchAtom;
    let checkboxGroup: CheckboxGroupAtom;
    let radioGroup: RadioGroupAtom;
    let combobox: ComboboxAtom;
    let select: SelectAtom;
    let timepicker: TimepickerAtom;
    let markAsDirty: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("form-field/form-field-visual-test");
        nickname = Atom.find(TextboxAtom, "nui-form-field-visual-test-nickname");
        city = Atom.find(TextboxAtom, "nui-form-field-visual-test-city");
        textbox = Atom.find(TextboxAtom, "nui-form-field-visual-test-textbox");
        checkbox = Atom.find(CheckboxAtom, "nui-form-field-visual-test-checkbox");
        switchElement = Atom.find(SwitchAtom, "nui-form-field-visual-test-switch");
        checkboxGroup = Atom.find(CheckboxGroupAtom, "nui-form-field-visual-test-checkbox-group");
        radioGroup = Atom.find(RadioGroupAtom, "nui-form-field-visual-test-radio");
        combobox = Atom.find(ComboboxAtom, "nui-form-field-visual-test-combobox");
        select = Atom.find(SelectAtom, "nui-form-field-visual-test-select");
        timepicker = Atom.find(TimepickerAtom, "nui-form-field-visual-test-timepicker");
        markAsDirty = element(by.id("nui-demo-mark-as-touched-button"));
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await markAsDirty.click();
        await camera.say.cheese("The entire form is invalid");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme test 1");
        
        await Helpers.switchDarkTheme("off");
        await nickname.acceptText("John Wick");
        await city.acceptText("New York");
        await textbox.acceptText("Default text");
        await checkbox.toggle();
        await switchElement.toggle();
        await checkboxGroup.getFirst().toggle();
        await radioGroup.getFirst().click();
        await combobox.select("Cabbage");
        await select.select("Cabbage");
        await timepicker.selectTime("17:30");
        await camera.say.cheese("The entire form is valid");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
