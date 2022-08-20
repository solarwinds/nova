import { ElementArrayFinder, ElementFinder } from "protractor";

import { BasicSelectAtom } from "./basic-select.atom";

export class SelectAtom extends BasicSelectAtom {
    public static CSS_CLASS = "nui-select";

    public getCurrentValue = async (): Promise<string> =>
        this.getElementByClass("nui-button__content").getText();

    public isSelectDisabled = async (): Promise<boolean> =>
        this.getElementByCss(".nui-select__layout-block.disabled").isPresent();

    public getLayoutBlock = (): ElementFinder =>
        this.getElementByClass("nui-select__layout-block");

    public getItemsWithNestedClass = (): ElementArrayFinder =>
        this.getElementsByCss(".nui-overlay .select-examples-custom-template");

    public isRequiredStyleDisplayed = async (): Promise<boolean> =>
        this.elementHasClass("nui-menu", "has-error");
}
