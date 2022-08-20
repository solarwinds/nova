import { browser, by, ElementFinder, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";

export class ToastAtom extends Atom {
    public static CSS_CLASS = "nui-toast";
    /** default tiomeout for toast */
    public static toastTimeout = 5000;
    /** time for 'fade out' animation */
    public static animationTimeout = 300;

    private root = this.getElement();
    public container = this.root.element(by.xpath(".."));
    private content = this.root
        .all(by.className(`${ToastAtom.CSS_CLASS}__content`))
        .first();
    public dismiss: ButtonAtom = Atom.findIn(
        ButtonAtom,
        this.content
            .all(by.className(`${ToastAtom.CSS_CLASS}__dismiss-button`))
            .first()
    );

    public getTitle = async (): Promise<string> =>
        this.root
            .element(by.css(`.${ToastAtom.CSS_CLASS}__content-title`))
            .getText();

    public getBody = async (): Promise<string> =>
        this.getBodyElement().getText();

    public isSuccessType = async (): Promise<boolean> =>
        this.isToastType("success");

    public isWarningType = async (): Promise<boolean> =>
        this.isToastType("warning");

    public isInfoType = async (): Promise<boolean> => this.isToastType("info");

    public isErrorType = async (): Promise<boolean> =>
        this.isToastType("error");

    /** Wait for countdown timout and extended timeout only. No need to wait for fade out animation. Angular will take care of it. */
    public waitUntilNotDisplayed = async (
        timeOut: number = ToastAtom.toastTimeout
    ): Promise<void> =>
        browser.wait(ExpectedConditions.stalenessOf(this.root), timeOut);

    public getToastsContainerPositioning = async (
        positionClass: string
    ): Promise<boolean> => Atom.hasClass(this.container, positionClass);

    public click = async (): Promise<void> => this.root.click();

    public unhover = async (): Promise<void> =>
        browser.actions().mouseMove(this.container, { x: -1, y: -1 }).perform();

    private getBodyElement = (): ElementFinder =>
        this.root.element(by.css(`.${ToastAtom.CSS_CLASS}__content-body`));

    private isToastType = (type: string): Promise<boolean> =>
        Atom.hasClass(this.root, `${ToastAtom.CSS_CLASS}--${type}`);
}
