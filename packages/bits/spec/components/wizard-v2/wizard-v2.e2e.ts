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

import { by, element, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { SpinnerAtom } from "../spinner/spinner.atom";
import { WizardV2Atom } from "./wizard-v2.atom";

describe("USERCONTROL Wizard V2: ", () => {
    let wizard: WizardV2Atom;
    let wizardDialog: WizardV2Atom;
    let wizardDynamic: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;
    let removeStepBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/test");

        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
        wizardDialog = Atom.find(
            WizardV2Atom,
            "nui-wizard-v2-horizontal-dialog"
        );
        wizardDynamic = Atom.find(
            WizardV2Atom,
            "nui-wizard-horizontal-dynamic"
        );
        openWizardDialogBtn = Atom.find(
            ButtonAtom,
            "nui-wizard-dialog-trigger"
        );
        removeStepBtn = Atom.find(ButtonAtom, "nui-remove-wizard-step-button");
    });

    describe("wizard v2 > ", () => {
        it("should have 3 steps", async () => {
            const steps = await wizard.steps;

            expect(steps.length).toEqual(3);
        });

        it("should wizard header have a title", async () => {
            expect(await wizard.getHeader(0).getLabelText()).toEqual("Step1");
        });

        it("should the next button be displayed", async () => {
            expect(await wizard.footer.nextButton.isDisplayed()).toBeTruthy();
        });

        it("should select the second step", async () => {
            await wizard.selectStep(0);
            await wizard.footer.nextButton.click();

            const hasClass = wizard
                .getHeader(1)
                .hasClass("nui-wizard-step-header--selected");

            expect(hasClass).toEqual(true);
        });
    });

    describe("wizard in dialog > ", () => {
        beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        afterEach(() => {
            Helpers.pressKey(Key.ESCAPE);
        });

        it("should wizard be displayed", async () => {
            expect(await wizardDialog.isDisplayed()).toEqual(true);
        });

        it("should wizard disappear when CANCEL button is pressed", async () => {
            const cancelBtn = wizardDialog.footer
                .getElement()
                .element(by.className("cancel"));

            await cancelBtn.click();

            expect(await wizardDialog.isPresent()).toEqual(false);
        });
    });

    describe("restore wizard state > ", () => {
        beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        it("should preserve the wizard step and open it up starting from the last page", async () => {
            const firstStepHeader = wizardDialog.getHeader(0);

            await firstStepHeader.click();
            await wizardDialog.moveToFinalStep();

            const finishButton = wizardDialog.footer
                .getElement()
                .element(by.className("complete"));

            await finishButton.click();
            await openWizardDialogBtn.click();

            const lastHeader = wizardDialog.getHeader(3);

            expect(
                await lastHeader.hasClass("nui-wizard-step-header--selected")
            ).toEqual(true);
            await Helpers.pressKey(Key.ESCAPE);
        });
    });

    describe("wizard with dynamic steps > ", () => {
        let addButton: ButtonAtom;

        beforeEach(() => {
            addButton = new ButtonAtom(
                wizardDynamic
                    .getStep(0)
                    .getElement()
                    .element(by.css(".nui-button.add"))
            );
        });

        it("should add a step dynamically", async () => {
            const stepLength = await wizardDynamic.steps.count();

            await addButton.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength + 1);
        });

        it("should remove a dynamically added step", async () => {
            const stepLength = await wizardDynamic.steps.count();

            await addButton.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength + 1);

            await removeStepBtn.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength);
        });
    });
});
