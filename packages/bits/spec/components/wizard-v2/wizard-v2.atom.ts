// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { by, ElementFinder, ElementArrayFinder } from "protractor";

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

    public get leftOverflowElement(): ElementFinder {
        return this.root.element(by.css(".overflow-left"));
    }

    public get rightOverflowElement(): ElementFinder {
        return this.root.element(by.css(".overflow-right"));
    }

    public async selectStep(index: number): Promise<void> {
        const header = this.getHeader(index);

        await header.click();
    }

    public async moveToFinalStep(): Promise<void> {
        const count = await this.steps.count();
        for (let i = 0; i < count; i++) {
            if (!(await this.footer.nextButton.isPresent())) {
                return;
            }
            await this.footer.nextButton.click();
        }
    }
}
