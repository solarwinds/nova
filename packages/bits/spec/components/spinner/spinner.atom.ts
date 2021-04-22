import { browser, by, ExpectedConditions } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class SpinnerAtom extends Atom {
    public static CSS_CLASS = "nui-spinner";
    public static defaultDelay = 250;

    private root = this.getElement();

    public getSize = async (): Promise<ISize> => this.root.getSize();

    public waitForDisplayed = async (timeout: number = SpinnerAtom.defaultDelay * 1.5): Promise<void> =>
        browser.wait(ExpectedConditions.visibilityOf(this.root), timeout, "Spinner was not displayed in time")

    public waitForHidden = async (timeout: number = SpinnerAtom.defaultDelay * 1.5): Promise<void> =>
        browser.wait(ExpectedConditions.stalenessOf(this.root), timeout, "Spinner was not hidden in time")

    public getLabel = async (): Promise<string> => this.root.element(by.css(".nui-spinner__message")).getText();

    public cancel = async (): Promise<void> => Atom.findIn(ButtonAtom, this.root).click();
}
