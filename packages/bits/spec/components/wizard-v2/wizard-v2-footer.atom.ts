import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../..";

export class WizardV2FooterAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-footer-container";

    private root = this.getElement();

    public getNextBtn(): Promise<ButtonAtom> {
        return this.getButtonAtom(".nui-button.btn.next");
    }

    public getCancelBtn(): Promise<ButtonAtom> {
        return this.getButtonAtom(".nui-button.cancel");
    }

    public getBusyBtn(): Promise<ButtonAtom> {
        return this.getButtonAtom(".nui-button.busy-btn");
    }

    public getFinishButton(): Promise<ButtonAtom> {
        return this.getButtonAtom(".nui-button.complete");
    }

    private getButtonAtom(query: string): Promise<ButtonAtom> {
        const button = this.root.element(by.css(query));

        return Promise.resolve(new ButtonAtom(button));
    }
}
