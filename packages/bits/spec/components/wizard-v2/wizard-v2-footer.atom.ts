import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../..";

export class WizardV2FooterAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-footer-container";

    public get nextButton(): ButtonAtom {
        return new ButtonAtom(
            this.getElement().element(by.css("button[nuiwizardnext]"))
        );
    }

    public get previousButton(): ButtonAtom {
        return new ButtonAtom(
            this.getElement().element(by.css("button[nuiwizardprevious]"))
        );
    }
}
