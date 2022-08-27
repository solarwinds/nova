import { by } from "protractor";
import { ElementArrayFinder } from "protractor/built/element";

import { Atom } from "../../atom";
import { WizardV2FooterAtom } from "./wizard-v2-footer.atom";
import { WizardV2StepHeaderAtom } from "./wizard-v2-step-header.atom";
import { WizardV2StepAtom } from "./wizard-v2-step.atom";

export class WizardV2Atom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-layout";

    private root = this.getElement();

    public async isPresent(): Promise<boolean> {
        return super.getElement().isPresent();
    }

    public get steps(): ElementArrayFinder {
        return this.root.all(
            by.css(
                ".nui-wizard-horizontal-content-container > .nui-wizard-horizontal-content"
            )
        );
    }

    public getStep(index: number): WizardV2StepAtom {
        const steps = this.root.all(
            by.css(
                ".nui-wizard-horizontal-content-container > .nui-wizard-horizontal-content"
            )
        );
        const step = steps.get(index);

        return new WizardV2StepAtom(step);
    }

    public getHeader(index: number): WizardV2StepHeaderAtom {
        const headers = this.root.all(by.css(".nui-wizard-step-header"));
        const header = headers.get(index);

        return new WizardV2StepHeaderAtom(header);
    }

    public get footer(): WizardV2FooterAtom {
        const footer = this.root.element(
            by.className("nui-wizard-horizontal-footer-container")
        );

        return new WizardV2FooterAtom(footer);
    }

    public get leftOverflowElement() {
        return this.root.element(by.css(".overflow-left"));
    }

    public get rightOverflowElement() {
        return this.root.element(by.css(".overflow-right"));
    }

    public async selectStep(index: number): Promise<void> {
        const header = this.getHeader(index);

        await header.click();
    }

    public async moveToFinalStep(): Promise<void> {
        const steps = await this.steps;

        for (const step of steps) {
            if (await this.footer.nextButton.isPresent()) {
                await this.footer.nextButton.click();
            }
        }
    }
}
