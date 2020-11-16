import { by, ElementFinder } from "protractor";

import { IconAtom, PopoverAtom } from "../../";
import { Atom } from "../../atom";

export class FormFieldAtom extends Atom {
    public static CSS_CLASS = "nui-form-field";

    private root = this.getElement();

    public async getHintText(): Promise<string> {
        // This can return atom, but for now it makes no sense
        return this.root.element(by.className("nui-help-hint")).getText();
    }
    public async getCaptionText(): Promise<string> {
        return this.root.element(by.className("nui-form-field__control-label")).getText();
    }
    public async getStateText(): Promise<string> {
        return this.root.element(by.className("nui-form-field__state-text")).getText();
    }
    public getInfoIcon(): IconAtom {
        return Atom.findIn(IconAtom, this.root.element(by.className("nui-form-field__control-label-container-info")));
    }
    public getInfoPopover(): PopoverAtom {
        return Atom.findIn(PopoverAtom, this.root.element(by.className("nui-form-field__control-label-container-info")));
    }
    public async getErrors(): Promise<string[]> {
        return this.root.all(by.className("nui-validation-message")).map<string>(async (el?: ElementFinder) => {
            if (!el) {
                throw new Error("headerCell is not defined");
            }
            return el.getText();
        });
    }
}
