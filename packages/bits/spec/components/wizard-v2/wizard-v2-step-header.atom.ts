import { by } from "protractor";

import { Atom } from "../../atom";

export class WizardV2StepHeaderAtom extends Atom {
    public static CSS_CLASS = "nui-wizard-step-header";

    private root = this.getElement();

    public click = async (): Promise<void> => this.root.click();

    public async getLabelText(): Promise<string> {
        const label = this.root.element(by.className("nui-wizard-step-header__text-label"));

        return label.getText();
    }
}
