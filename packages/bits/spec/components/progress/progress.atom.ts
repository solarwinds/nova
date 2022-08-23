import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class ProgressAtom extends Atom {
    public static CSS_CLASS = "nui-progress";

    public getCancelButton = (): ButtonAtom =>
        Atom.findIn(
            ButtonAtom,
            this.getElement().element(by.className("nui-progress__cancel"))
        );

    public canCancel = async (): Promise<boolean> =>
        await this.getCancelButton().isPresent();

    public cancelProgress = async (): Promise<void> =>
        await this.getCancelButton().click();

    public getWidth = async (): Promise<number> =>
        Number(
            (await this.getElement().getCssValue("width")).replace("px", "")
        );

    public getLabel = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__message"))
            .getText();

    public getPercent = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__number"))
            .getText();

    public getOptionalDescription = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__hint"))
            .getText();

    public isProgressBarDisplayed = async (): Promise<boolean> =>
        await this.getElement()
            .element(by.className("nui-progress__bar"))
            .isDisplayed();

    public async isIndeterminate(): Promise<boolean> {
        return await Atom.hasClass(
            this.getElement().element(by.className("nui-progress__bar")),
            "nui-progress--indeterminate"
        );
    }
}
