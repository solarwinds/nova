import {
    browser,
    by,
    element,
    ElementFinder,
    ExpectedConditions,
} from "protractor";

import { Atom } from "../../atom";

import { OverlayContentAtom } from "./overlay-content.atom";

export class PopupAtom extends Atom {
    public static CSS_CLASS = "nui-popup";
    private body = element(by.tagName("body"));

    private popupBox = Atom.findIn(OverlayContentAtom, this.getElement());
    private popupBoxDetached = Atom.findIn(OverlayContentAtom, this.body);

    public getPopupToggle = (): ElementFinder =>
        this.getElement().element(by.css("[nuiPopupToggle]"));

    public async isOpened(): Promise<boolean> {
        return (await this.popupBox.count(this.getElement())) === 1;
    }

    public async isOpenedAppendToBody(): Promise<boolean> {
        return (await this.popupBoxDetached.count()) === 1;
    }

    public async open(): Promise<void> {
        const toggle = this.getPopupToggle();
        await toggle.click();
        return browser.wait(
            ExpectedConditions.visibilityOf(this.popupBox.getElement()),
            500
        );
    }

    public getPopupBox = () => this.popupBox.getElement();
    public getPopupBoxDetached = () => this.popupBoxDetached;
    public getPopupBoxDetachedArea = () =>
        this.popupBoxDetached.getElement().element(by.css(".nui-popup__area"));
}
