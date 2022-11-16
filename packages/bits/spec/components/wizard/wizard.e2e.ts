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

import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { DialogAtom } from "../dialog/dialog.atom";
import { TextboxAtom } from "../textbox/textbox.atom";
import { WizardStepAtom } from "./wizard-step.atom";
import { WizardAtom } from "./wizard.atom";

describe("USERCONTROL Wizard >", () => {
    const wizard: WizardAtom = Atom.find(WizardAtom, "nui-demo-wizard");
    const wizardValidation: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-validation"
    );
    const wizardDisable: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-disable"
    );
    const wizardHide: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-hide-show"
    );
    const wizardDynamic: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-add-dynamic"
    );
    const wizardBusy: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-busy"
    );
    const wizardDialog: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-dialog"
    );
    const wizardConstantHeight: WizardAtom = Atom.find(
        WizardAtom,
        "nui-demo-wizard-constant-height"
    );
    const wizardStep: WizardStepAtom = Atom.find(
        WizardStepAtom,
        "nui-demo-wizard-step"
    );
    const wizardDialogButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-dialog-wizard-btn"
    );
    const disableButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-disable-button"
    );
    const hideButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-hide-button"
    );
    const visibleButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-show-button"
    );
    const busyButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-busy-button"
    );
    const addButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-dynamic-button"
    );
    const dialogWizard: DialogAtom = new DialogAtom(
        element(by.className("nui-dialog"))
    );
    const stepInputName: TextboxAtom = Atom.find(TextboxAtom, "stepInputName");
    const stepInputEmail: TextboxAtom = Atom.find(
        TextboxAtom,
        "stepInputEmail"
    );
    const stepInputPassword: TextboxAtom = Atom.find(
        TextboxAtom,
        "stepInputPassword"
    );

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard/wizard-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    describe("by default", () => {
        it("should be defined", () => {
            expect(wizard).toBeDefined();
        });

        it("should have 2 steps", async () => {
            const steps = await wizard.getSteps();
            expect(steps.length).toBe(2);
        });

        it("should display header", () => {
            expect(wizard.getHeader()).toBeDefined();
        });

        it("should display title", async () => {
            const steps = await wizard.getHeaderSteps();
            expect(steps[0]).toBe("First");
            expect(steps[1]).toBe("Final");
        });

        it("should display title similar to wizard step title", async () => {
            const steps = await wizard.getHeaderSteps();
            expect(steps[0]).toBe(await wizardStep.getStepTitle());
        });

        it("should displayed next button", async () => {
            expect(await wizard.nextButton.isVisible()).toBeTruthy();
        });

        it("should not displayed back button on first step", async () => {
            expect(await wizard.backButton.isPresent()).toBeFalsy();
        });

        it("should displayed back button", async () => {
            await wizard.next();
            expect(await wizard.backButton.isVisible()).toBeTruthy();
        });

        it("should allow user to go back", async () => {
            await wizard.back();
            expect(await wizard.getActiveStep().getText()).toContain("First");
        });

        it("should allow user clicked on visited step", async () => {
            await wizard.goToStep(1);
            expect(await wizard.getActiveStep().getText()).toContain("Final");
        });
    });

    describe("validation", () => {
        beforeEach(async () => {
            await stepInputName.acceptText("Name");
            await stepInputEmail.acceptText("email@com.com");
            await stepInputPassword.acceptText("12345678a");
        });

        it("should not allow user go next if validation is required", async () => {
            await stepInputEmail.clearText();
            await stepInputEmail.acceptText("1");
            await wizardValidation.next();
            expect(await wizardValidation.getActiveStep().getText()).toContain(
                "Step with validation"
            );
        });

        it("should validate", async () => {
            await wizardValidation.next();
            expect(await wizardValidation.getActiveStep().getText()).toContain(
                "Second step"
            );
        });
    });

    describe("wizard step control >", () => {
        it("should disable 'Second' wizard step", async () => {
            await disableButton.click();
            await wizardDisable.next();
            expect(await wizardDisable.getActiveStep().getText()).toContain(
                "Disable next step"
            );
        });

        it("should hide step in wizard", async () => {
            await hideButton.click();
            const steps = await wizardHide.getSteps();
            expect(steps.length).toBe(1);
        });

        it("should hide only one step in wizard", async () => {
            await hideButton.click();
            const steps = await wizardHide.getSteps();
            expect(steps.length).toBe(1);
        });

        it("should make hidden step is visible in wizard", async () => {
            await visibleButton.click();
            const steps = await wizardHide.getSteps();
            expect(steps.length).toBe(2);
        });

        it("should add step in wizard", async () => {
            await addButton.click();
            const steps = await wizardDynamic.getSteps();
            expect(steps.length).toBe(2);
        });
    });

    describe("wizard busy state >", () => {
        const firstStep = Atom.findIn(
            WizardStepAtom,
            wizardBusy.getElement(),
            0
        );
        const spinner = firstStep.busy.getSpinner();

        it("should add busy to wizard step", async () => {
            await busyButton.click();
            await spinner.waitForDisplayed();
            expect(await spinner.isDisplayed()).toEqual(
                true,
                "busy spinner didn't show up"
            );
            expect(await wizardBusy.nextButton.isBusy()).toBeTruthy(
                "NEXT button is not busy"
            );

            await busyButton.click();
            await spinner.waitForHidden();
            expect(await spinner.isPresent()).toEqual(
                false,
                "busy spinner didn't hide"
            );
            expect(await wizardBusy.nextButton.isBusy()).toEqual(
                false,
                "NEXT button is still busy"
            );
        });
    });

    describe("wizard dialog >", () => {
        it("should show wizard dialog", async () => {
            await wizardDialogButton.click();
            expect(await dialogWizard.isDialogDisplayed()).toBeTruthy();
        });

        it("should dialog contain wizard", () => {
            expect(wizardDialog).toBeDefined();
        });

        it("should contain finish button on last step", async () => {
            await wizardDialog.next();
            expect(wizardDialog.finishButton).toBeDefined();
        });

        it("should close wizard dialog on cancel button click", async () => {
            await wizardDialog.cancel();
            expect(await dialogWizard.isDialogDisplayed()).toBeFalsy();
        });
    });

    describe("wizard constant height >", () => {
        it("should properly set wizard container height via input", async () => {
            expect(await wizardConstantHeight.getContainerHeight()).toEqual(
                200
            );
        });

        it("wizard container height should remain same on all steps", async () => {
            expect(await wizardConstantHeight.getContainerHeight()).toEqual(
                200
            );
            await wizardConstantHeight.next();
            expect(await wizardConstantHeight.getContainerHeight()).toEqual(
                200
            );
        });
    });
});
