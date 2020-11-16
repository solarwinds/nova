import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";

export class ButtonAtom extends Atom {
    public static CSS_CLASS = "nui-button";

    private root = this.getElement();

    public click = async (): Promise<void> => this.root.click();

    public getText = async (): Promise<string> => this.root.element(by.className("nui-button__content")).getText();

    public isDisabled = async (): Promise<boolean> => ! (await this.root.isEnabled());

    public isVisible = async (): Promise<boolean> => this.isDisplayed();

    public isBusy = async (): Promise<boolean> => this.hasClass("is-busy");

    public getTextColor = async (): Promise<string> => this.root.getCssValue("color");

    public getBackgroundColor = async (): Promise<string> => this.root.getCssValue("background-color");

    public getBorderStyle = async (): Promise<string> => this.root.getCssValue("border-color");

    public mouseDown = async (): Promise<void> => {
        const rootWebElement = await this.root.getWebElement();
        await browser.actions().mouseMove(rootWebElement).perform();
        return browser.actions().mouseDown().perform();
    }

    public mouseUp = async (): Promise<void> => {
        const rootWebElement = await this.root.getWebElement();
        await browser.actions().mouseMove(rootWebElement).perform();
        return browser.actions().mouseUp().perform();
    }

    public isIconShown = async (): Promise<boolean> => this.root.element(by.className("nui-icon")).isPresent();

    public getIcon = async (): Promise<IconAtom | undefined> => await Atom.findCount(IconAtom, this.root) ? Atom.findIn(IconAtom, this.root) : undefined;

    public async mouseDownAndHold(ms: number): Promise<void> {
        await this.mouseDown();
        await browser.sleep(ms);
        await this.mouseUp();
        return;
    }
}
