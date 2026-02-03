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

import { WizardV2FooterAtom } from "./wizard-v2-footer.atom";
import { WizardV2StepHeaderAtom } from "./wizard-v2-step-header.atom";
import { WizardV2StepAtom } from "./wizard-v2-step.atom";
import { Atom } from "../../atom";
import { expect } from "../../setup";

export class WizardV2Atom extends Atom {
    public static CSS_CLASS = "nui-wizard-horizontal-layout";

    public get steps(): Locator {
        return this.getLocator().locator(
            ".nui-wizard-horizontal-content-container > .nui-wizard-horizontal-content"
        );
    }

    public get headers(): Locator {
        return this.getLocator().locator(".nui-wizard-step-header");
    }

    public get footer(): WizardV2FooterAtom {
        return new WizardV2FooterAtom(
            this.getLocator().locator(".nui-wizard-horizontal-footer-container")
        );
    }

    public get leftOverflowElement(): Locator {
        return this.getLocator().locator(".overflow-left");
    }

    public get rightOverflowElement(): Locator {
        return this.getLocator().locator(".overflow-right");
    }

    public getStep = (index: number): WizardV2StepAtom =>
        new WizardV2StepAtom(this.steps.nth(index));

    public getHeader = (index: number): WizardV2StepHeaderAtom =>
        new WizardV2StepHeaderAtom(this.headers.nth(index));

    public selectStep = async (index: number): Promise<void> => {
        await this.getHeader(index).click();
    };

    public next = async (): Promise<void> => {
        await this.footer.nextButton.click();
    };

    public back = async (): Promise<void> => {
        await this.footer.backButton.click();
    };

    public finish = async (): Promise<void> => {
        await this.footer.finishButton.click();
    };

    public cancel = async (): Promise<void> => {
        await this.footer.cancelButton.click();
    };

    public moveToFinalStep = async (): Promise<void> => {
        const count = await this.steps.count();
        for (let i = 0; i < count; i++) {
            const nextButton = this.footer.nextButton;
            if (!(await nextButton.getLocator().isVisible())) {
                return;
            }
            await nextButton.click();
        }
    };

    public toHaveStepsCount = async (expected: number): Promise<void> => {
        await expect(this.steps).toHaveCount(expected);
    };

    public toHaveHeadersCount = async (expected: number): Promise<void> => {
        await expect(this.headers).toHaveCount(expected);
    };

    public toHaveLeftOverflowVisible = async (): Promise<void> => {
        await expect(this.leftOverflowElement).toBeVisible();
    };

    public toHaveRightOverflowVisible = async (): Promise<void> => {
        await expect(this.rightOverflowElement).toBeVisible();
    };

    public toHaveLeftOverflowHidden = async (): Promise<void> => {
        await expect(this.leftOverflowElement).toBeHidden();
    };

    public toHaveRightOverflowHidden = async (): Promise<void> => {
        await expect(this.rightOverflowElement).toBeHidden();
    };
}
