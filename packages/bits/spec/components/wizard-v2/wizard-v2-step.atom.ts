import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../..";

export class WizardV2StepAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-content";

    private root = this.getElement();

    public getAddButton(): ButtonAtom {
        const button = this.root.element(by.css(".nui-button.add"));

        return new ButtonAtom(button);
    }
}
