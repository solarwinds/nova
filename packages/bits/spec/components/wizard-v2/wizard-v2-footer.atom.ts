import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../..";

export class WizardV2FooterAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-footer-container";

    private root = this.getElement();

    public async getNextBtn(): Promise<ButtonAtom> {
        const button = this.root.element(by.css(".nui-button.btn.next"));

        return new ButtonAtom(button);
    }
}
