import { by } from "protractor";

import { Atom } from "../../atom";

export class WizardV2StepHeaderAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-step-header";

    private root = this.getElement();

    public async getLabelText(): Promise<any> {
        const label = this.root.element(by.className("nui-wizard-step-header__text-label"));

        return label.getText();
    }
}
