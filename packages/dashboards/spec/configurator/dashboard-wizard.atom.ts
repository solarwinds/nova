import { by, ElementFinder } from "protractor";

import { Atom, ButtonAtom } from "@nova-ui/bits/sdk/atoms";

export class DashboardWizardAtom extends Atom {
    public static CSS_CLASS = "nui-dashwiz";

    private root = this.getElement();

    public backButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__back-button"))
    );
    public nextButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__next-button"))
    );
    public finishButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__finish-button"))
    );
    public cancelButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__cancel-button"))
    );

    public back = async (): Promise<void> => this.backButton.click();

    public next = async (): Promise<void> => this.nextButton.click();

    public cancel = async (): Promise<void> => this.cancelButton.click();

    public finish = async (): Promise<void> => this.finishButton.click();

    public getHeader = (): ElementFinder =>
        this.root.element(by.css(".nui-dashwiz__header"));

    public getActiveStep = (): ElementFinder =>
        this.root.element(by.css(".nui-dashwiz-step--active"));
}
