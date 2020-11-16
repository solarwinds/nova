import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class SwitchAtom extends Atom {
    public static ON_CSS = "nui-switched";
    public static CSS_CLASS = "nui-switch";

    public toggle = async (): Promise<void> => this.slider().click();

    public container(): ElementFinder { return super.getElement().element(by.className("nui-switch__container")); }

    public labelElement(): ElementFinder { return super.getElement().element(by.className("nui-switch__label")); }

    public labelText = async (): Promise<string> => this.labelElement().getText();

    public slider(): ElementFinder { return super.getElement().element(by.className("nui-switch__bar")); }

    public async isOn(): Promise<boolean> { return super.hasClass(SwitchAtom.ON_CSS); }

    public async disabled(): Promise<boolean> { return super.getElement().getAttribute("class").then((classString) => classString.indexOf("disabled") !== -1); }
}
