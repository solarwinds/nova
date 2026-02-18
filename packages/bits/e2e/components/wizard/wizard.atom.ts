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

import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { WizardStepAtom } from "./wizard-step.atom";

export class WizardAtom extends Atom {
    public static CSS_CLASS = "nui-wizard";

    public get backButton(): ButtonAtom {
        return new ButtonAtom(this.getLocator().locator(".nui-wizard__back-button"));
    }

    public get nextButton(): ButtonAtom {
        return new ButtonAtom(this.getLocator().locator(".nui-wizard__next-button"));
    }

    public get finishButton(): ButtonAtom {
        return new ButtonAtom(this.getLocator().locator(".nui-wizard__finish-button"));
    }

    public get cancelButton(): ButtonAtom {
        return new ButtonAtom(this.getLocator().locator(".nui-wizard__cancel-button"));
    }

    public get header(): Locator {
        return this.getLocator().locator(".nui-wizard__header");
    }

    public get activeStep(): Locator {
        return this.getLocator().locator(".nui-wizard__header-step--active");
    }

    public get headerSteps(): Locator {
        return this.getLocator().locator(".nui-wizard__header-step");
    }

    public get stepContainers(): Locator {
        return this.getLocator().locator(".nui-wizard__header-step-container");
    }

    public get container(): Locator {
        return this.getLocator().locator(".nui-wizard__container");
    }

    public back = async (): Promise<void> => this.backButton.click();

    public cancel = async (): Promise<void> => this.cancelButton.click();

    public finish = async (): Promise<void> => this.finishButton.click();

    public next = async (): Promise<void> => this.nextButton.click();

    public async getHeaderStepTitles(): Promise<string[]> {
        const steps = this.headerSteps;
        const count = await steps.count();
        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
            const title = await steps.nth(i).locator(".nui-wizard__header-step-title").first().textContent();
            titles.push(title ?? "");
        }
        return titles;
    }

    public async getSteps(): Promise<WizardStepAtom[]> {
        const containers = this.stepContainers;
        const count = await containers.count();
        const steps: WizardStepAtom[] = [];
        for (let i = 0; i < count; i++) {
            steps.push(new WizardStepAtom(containers.nth(i)));
        }
        return steps;
    }

    public async getContainerHeight(): Promise<number> {
        const box = await this.container.boundingBox();
        return box?.height ?? 0;
    }

    public goToStep = async (index: number): Promise<void> => {
        await this.headerSteps.nth(index).click();
    };
}
