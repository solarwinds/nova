import {
    by,
    ElementFinder
} from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class TextboxNumberAtom extends Atom {
    public static CSS_CLASS = "nui-textbox-number";

    public upButton: ButtonAtom;
    public downButton: ButtonAtom;
    private input: ElementFinder;

    constructor(private rootElement: ElementFinder) {
        super(rootElement);

        this.upButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("nui-textbox-number__up-button")));
        this.downButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("nui-textbox-number__down-button")));
        this.input = rootElement.element(by.className("nui-textbox__input"));
    }

    public getValue = async (): Promise<string> => this.input.getAttribute("value");

    public getPlaceholder = async (): Promise<string> => this.input.getAttribute("placeholder");

    public acceptText = async (text: string): Promise<void> => this.input.sendKeys(text);

    public clearText = async (): Promise<void> => this.input.clear();

    public isDisabled = async (): Promise<boolean> => await this.input.getAttribute("disabled") !== null
        && await this.upButton.isDisabled()
        && await this.downButton.isDisabled()

    public isReadonly = async (): Promise<boolean> => await this.input.getAttribute("readonly") !== null
        && await this.upButton.isDisabled()
        && await this.downButton.isDisabled()

    public isValid = async (): Promise<boolean> => !(await this.rootElement.getAttribute("class")).includes("has-error");

    public getInputId = async (): Promise<string> => await this.input.getId();

}
