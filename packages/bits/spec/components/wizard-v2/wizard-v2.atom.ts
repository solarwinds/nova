import { by } from "protractor";

import { Atom } from "../../atom";
import { ElementArrayFinder } from "protractor/built/element";
import { WizardV2StepAtom } from "./wizard-v2-step.atom";
import { WizardV2StepHeaderAtom } from "./wizard-v2-step-header.atom";
import { WizardV2FooterAtom } from "./wizard-v2-footer.atom";

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
        const headers = this.root.all(by.css(".nui-wizard-step-header"));
        const header = headers.get(index);

        return new WizardV2StepHeaderAtom(header);
    }

    public async getFooter(): Promise<WizardV2FooterAtom> {
        const footer = this.root.element(by.className("nui-wizard-horizontal-footer-container"));

        return new WizardV2FooterAtom(footer);
    }

    public async selectStep(index: number): Promise<void> {
        const header = await this.getHeader(index);

        await header.click();
    }

    public async moveToFinalStep(): Promise<void> {
        const steps = await this.getSteps();
        const footer = await this.getFooter();

        for (const step of steps) {
            const next = await footer.getNextBtn();

            if (await next.isPresent()) {
                await next.click();
            }
        }
    }
}
