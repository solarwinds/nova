import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class SearchAtom extends Atom {
    public static CSS_CLASS = "nui-search";

    public async acceptInput(input: string) { return super.getElement().element(by.css(".nui-search__input-control")).sendKeys(input); }

    public async click(): Promise<void> { return super.getElement().click(); }

    public getCancelButton = (): ButtonAtom => Atom.findIn(ButtonAtom, this.getElement().element(by.css(".nui-search__button-cancel")));

    public getSearchButton = (): ButtonAtom => Atom.findIn(ButtonAtom, this.getElement().element(by.css(".nui-button[icon=search]")));

    public async getValueAttr(): Promise<string> { return super.getElement().element(by.tagName("input")).getAttribute("value"); }

    // please, call 'browser.driver.switchTo().defaultContent()' after each calling this method (just in case)
    public isFocused = async (): Promise<boolean> => this.getElement().element(by.tagName("input")).equals(await browser.driver.switchTo().activeElement());
}
