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

import { WizardStepAtom } from "./wizard-step.atom";
import { WizardAtom } from "./wizard.atom";
import { Atom } from "../../atom";
import { Animations, expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { DialogAtom } from "../dialog/dialog.atom";
import { TextboxAtom } from "../textbox/textbox.atom";
import { W } from "@angular/cdk/keycodes";

test.describe("USERCONTROL Wizard >", () => {
    let wizard: WizardAtom;
    let wizardValidation: WizardAtom;
    let wizardDisable: WizardAtom;
    let wizardHide: WizardAtom;
    let wizardDynamic: WizardAtom;
    let wizardBusy: WizardAtom;
    let wizardDialog: WizardAtom;
    let wizardConstantHeight: WizardAtom;
    let wizardStep: WizardStepAtom;
    let wizardDialogButton: ButtonAtom;
    let disableButton: ButtonAtom;
    let hideButton: ButtonAtom;
    let visibleButton: ButtonAtom;
    let busyButton: ButtonAtom;
    let addButton: ButtonAtom;
    let dialogWizard: DialogAtom;
    let stepInputName: TextboxAtom;
    let stepInputEmail: TextboxAtom;
    let stepInputPassword: TextboxAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("wizard/wizard-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        wizard = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard").first<WizardAtom>(WizardAtom);
        wizardValidation = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-validation").first<WizardAtom>(WizardAtom);
        wizardDisable = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-disable");
        wizardHide = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-hide-show");
        wizardDynamic = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-add-dynamic");
        wizardBusy = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-busy");
        wizardDialog = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-dialog");
        wizardConstantHeight = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-constant-height");
        wizardStep = Atom.find<WizardStepAtom>(WizardStepAtom, "nui-demo-wizard-step");
        wizardDialogButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-dialog-wizard-btn", true);
        disableButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-disable-button", true);
        hideButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-hide-button", true);
        visibleButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-show-button", true);
        busyButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-busy-button", true);
        addButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-dynamic-button", true);
        dialogWizard = new DialogAtom(page.locator(".nui-dialog"));
        stepInputName = Atom.find<TextboxAtom>(TextboxAtom, "stepInputName").first<TextboxAtom>(TextboxAtom);
        stepInputEmail = Atom.find<TextboxAtom>(TextboxAtom, "stepInputEmail").first<TextboxAtom>(TextboxAtom);
        stepInputPassword = Atom.find<TextboxAtom>(TextboxAtom, "stepInputPassword").first<TextboxAtom>(TextboxAtom);
    });

    test.describe("by default", () => {
        test("should be defined", async () => {
            await wizard.toBeVisible();
        });

        test("should have 2 steps", async () => {
            await expect(wizard.headerSteps).toHaveCount(2);
        });

        test("should display header", async () => {
            await expect(wizard.header).toBeVisible();
        });

        test("should display title", async () => {
            await expect(wizard.headerSteps.nth(0)).toContainText("First");
            await expect(wizard.headerSteps.nth(1)).toContainText("Final");
        });

        test("should display title similar to wizard step title", async () => {
            await expect(wizard.headerSteps.nth(0)).toContainText(await wizardStep.getStepTitle());
        });

        test("should displayed next button", async () => {
            await wizard.nextButton.toBeVisible();
        });

        test("should not displayed back button on first step", async () => {
            await wizard.backButton.toBeHidden();
        });

        test("should displayed back button", async () => {
            await wizard.next();
            await wizard.backButton.toBeVisible();
        });

        test("should allow user to go back", async () => {
            await wizard.next();
            await wizard.back();
            await expect(wizard.activeStep).toContainText("First");
        });

        test("should allow user clicked on visited step", async () => {
            await wizard.next();
            await wizard.goToStep(0);
            await expect(wizard.activeStep).toContainText("First");
        });
    });

    test.describe("validation", () => {
        test.beforeEach(async () => {
            await stepInputName.acceptText("Name");
            await stepInputEmail.acceptText("email@com.com");
            await stepInputPassword.acceptText("12345678a");
        });

        test("should not allow user go next if validation is required", async () => {
            await stepInputEmail.clearText();
            await stepInputEmail.acceptText("1");
            await wizardValidation.next();
            await expect(wizardValidation.activeStep).toContainText("Step with validation");
        });

        test("should validate", async () => {
            await wizardValidation.next();
            await expect(wizardValidation.activeStep).toContainText("Second step");
        });
    });

    test.describe("wizard step control >", () => {
        test("should disable 'Second' wizard step", async () => {
            await disableButton.click();
            await wizardDisable.next();
            await expect(wizardDisable.activeStep).toContainText("Disable next step");
        });

        test("should hide only one step in wizard", async () => {
            await hideButton.click();
            await expect(wizardHide.headerSteps.nth(1)).toBeHidden();
        });

        test("should make hidden step is visible in wizard", async () => {
            await hideButton.click();
            await expect(wizardHide.headerSteps.nth(1)).toBeHidden();
            await visibleButton.click();
            await expect(wizardHide.headerSteps.nth(1)).toBeVisible();
        });

        test("should add step in wizard", async () => {
            await addButton.click();
            await expect(wizardHide.headerSteps.nth(0)).toBeVisible();
            await expect(wizardHide.headerSteps.nth(1)).toBeVisible();
        });
    });

    test.describe("wizard busy state >", () => {
        test("should add busy to wizard step", async () => {
            const firstStep = Atom.findIn<WizardStepAtom>(WizardStepAtom, wizardBusy.getLocator());
            const spinner = firstStep.busy.getSpinner();

            await busyButton.click();
            await spinner.toBeVisible();
            await wizardBusy.nextButton.isBusy();

            await busyButton.click();
            await spinner.toBeHidden();
            await wizardBusy.nextButton.isNotBusy();
        });
    });

    test.describe("wizard dialog >", () => {
        test("should show wizard dialog", async () => {
            await wizardDialogButton.click();
            await dialogWizard.toBeVisible();
        });

        test("should dialog contain wizard", async () => {
            await wizardDialogButton.click();
            await wizardDialog.toBeVisible();
        });

        test("should contain finish button on last step", async () => {
            await wizardDialogButton.click();
            await wizardDialog.next();
            await wizardDialog.next();
            await wizardDialog.next();
            await wizardDialog.finishButton.toBeVisible();
        });

        test("should close wizard dialog on cancel button click", async () => {
            await wizardDialogButton.click();
            await dialogWizard.toBeVisible();
            await wizardDialog.cancel();
            await dialogWizard.toBeHidden();
        });
    });

    test.describe("wizard constant height >", () => {
        test("should properly set wizard container height via input", async () => {
            const height = await wizardConstantHeight.getContainerHeight();
            expect(height).toEqual(200);
        });

        test("wizard container height should remain same on all steps", async () => {
            expect(await wizardConstantHeight.getContainerHeight()).toEqual(200);
            await wizardConstantHeight.next();
            expect(await wizardConstantHeight.getContainerHeight()).toEqual(200);
        });
    });
});
