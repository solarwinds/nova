import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class WizardV2StepAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-content";

    private root = this.getElement();
}
