import { browser, by, ElementFinder, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";

export class MessageAtom extends Atom {
    public static CSS_CLASS = "nui-message";
    public static animationDuration = 300;
    private root = this.getElement();

    public getDismissButton = (): ElementFinder =>
        this.root.element(by.className("nui-message-dismiss-button"));

    public dismissMessage = async (): Promise<void | null> => {
        const button = this.getDismissButton();
        if (!(await button.isDisplayed())) {
            return null;
        }
        await button.click();
        return browser.wait(
            ExpectedConditions.invisibilityOf(this.root),
            MessageAtom.animationDuration * 1.5
        );
    };

    public isVisible = async (): Promise<boolean> => this.root.isDisplayed();

    public isDismissable = async (): Promise<boolean> =>
        this.getDismissButton().isDisplayed();

    public getBorderStyle = async () => this.root.getCssValue("border-color");

    public getStatusIcon = (): IconAtom =>
        Atom.findIn(
            IconAtom,
            this.getElement().element(by.className("nui-message-icon"))
        );

    public getBackgroundColor = async (): Promise<string> =>
        this.root.getCssValue("background-color");

    public getContent = async (): Promise<string> =>
        this.root.element(by.className("nui-message-content")).getText();
}
