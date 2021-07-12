import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { ElementArrayFinder } from "protractor/built/element";
import { WizardV2StepAtom } from "./wizard-v2-step.atom";
import { WizardV2StepHeaderAtom } from "./wizard-v2-step-header.atom";

export class WizardV2Atom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-layout";

    private root = this.getElement();

    public async isPresent(): Promise<boolean> {
        return super.getElement().isPresent();
    }

    public async getSteps(): Promise<ElementArrayFinder> {
        return this.root.all(by.css(".nui-wizard-horizontal-content-container > .nui-wizard-horizontal-content"));
}

    public async getStep(index: number): Promise<WizardV2StepAtom> {
        const steps = this.root.all(by.css(".nui-wizard-horizontal-header-container > .nui-wizard-horizontal-content"));
        const step = steps.get(index);

        return new WizardV2StepAtom(step);
    }

    public async getHeader(index: number): Promise<WizardV2StepHeaderAtom> {
        const headers = this.root.all(by.css(".nui-wizard-horizontal-header-wrapper"));
        const header = headers.get(index);

        return new WizardV2StepHeaderAtom(header);
    }

    public getFirstStep(): void {}

    public getLastStep(): void {}
}
