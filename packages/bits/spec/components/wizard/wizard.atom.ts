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

import { by, ElementFinder } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { WizardStepAtom } from "../wizard/wizard-step.atom";

export class WizardAtom extends Atom {
    public static CSS_CLASS = "nui-wizard";

    private root = this.getElement();

    public backButton = new ButtonAtom(
        this.root.element(by.className("nui-wizard__back-button"))
    );
    public nextButton = new ButtonAtom(
        this.root.element(by.className("nui-wizard__next-button"))
    );
    public finishButton = new ButtonAtom(
        this.root.element(by.className("nui-wizard__finish-button"))
    );
    public cancelButton = new ButtonAtom(
        this.root.element(by.className("nui-wizard__cancel-button"))
    );

    public back = async (): Promise<void> => this.backButton.click();

    public cancel = async (): Promise<void> => this.cancelButton.click();

    public finish = async (): Promise<void> => this.finishButton.click();

    public getHeader = (): ElementFinder =>
        this.root.element(by.css(".nui-wizard__header"));

    public getActiveStep = (): ElementFinder =>
        this.root.element(by.css(".nui-wizard__header-step--active"));

    public next = async (): Promise<void> => this.nextButton.click();

    public async getHeaderSteps(): Promise<any[]> {
        const stepsEl = this.root.element(
            by.className("nui-wizard__header-steps")
        );

        return stepsEl
            .all(by.className("nui-wizard__header-step"))
            .map(async (el?: ElementFinder) => {
                if (!el) {
                    throw new Error("elementFinder is not defined");
                }
                return el
                    .all(by.className("nui-wizard__header-step-title"))
                    .first()
                    .getText();
            });
    }

    public async getSteps(): Promise<WizardStepAtom[]> {
        const stepsEl = this.root.element(by.className("nui-wizard__header"));

        // this should really be a map operation.  However, map has a bug- if you put an element finder
        // in it, it will try to resolve EVERYTHING, and causes node to go into an infinite loop
        return stepsEl
            .all(by.className("nui-wizard__header-step-container"))
            .reduce((accumulator: WizardStepAtom[], el: ElementFinder) => {
                accumulator.push(new WizardStepAtom(el));
                return accumulator;
            }, []);
    }

    public async getContainerHeight(): Promise<number> {
        return this.root
            .element(by.className("nui-wizard__container"))
            .getSize()
            .then((elemSize: ISize) => elemSize.height);
    }

    public async goToStep(index: number): Promise<void> {
        return this.root
            .all(by.className("nui-wizard__header-step"))
            .get(index)
            .click();
    }
}
