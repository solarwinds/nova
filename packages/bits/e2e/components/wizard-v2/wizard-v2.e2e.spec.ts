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

import { WizardV2Atom } from "./wizard-v2.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

test.describe("USERCONTROL Wizard V2: ", () => {
    let wizard: WizardV2Atom;
    let wizardDialog: WizardV2Atom;
    let wizardDynamic: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;
    let removeStepBtn: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("wizard-v2/test", page);

        wizard = Atom.find<WizardV2Atom>(WizardV2Atom, "nui-wizard-v2-horizontal", true);
        wizardDialog = Atom.find<WizardV2Atom>(
            WizardV2Atom,
            "nui-wizard-v2-horizontal-dialog",
            true
        );
        wizardDynamic = Atom.find<WizardV2Atom>(
            WizardV2Atom,
            "nui-wizard-horizontal-dynamic",
            true
        );
        openWizardDialogBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-wizard-dialog-trigger",
            true
        );
        removeStepBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-remove-wizard-step-button",
            true
        );
    });

    test.describe("wizard v2 > ", () => {
        test("should have 3 steps", async () => {
            await wizard.toHaveStepsCount(3);
        });

        test("should wizard header have a title", async () => {
            await wizard.getHeader(0).toHaveLabelText("Step1");
        });

        test("should the next button be displayed", async () => {
            await wizard.footer.nextButton.toBeVisible();
        });

        test("should select the second step", async () => {
            await wizard.selectStep(0);
            await wizard.next();

            await wizard.getHeader(1).toContainClass("nui-wizard-step-header--selected");
        });
    });

    test.describe("wizard in dialog > ", () => {
        test.beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        test.afterEach(async () => {
            await Helpers.pressKey("Escape");
        });

        test("should wizard be displayed", async () => {
            await wizardDialog.toBeVisible();
        });

        test("should wizard disappear when CANCEL button is pressed", async () => {
            const cancelBtn = wizardDialog.footer.getLocator().locator(".cancel");
            await cancelBtn.click();

            await wizardDialog.toBeHidden();
        });
    });

    test.describe("restore wizard state > ", () => {
        test.beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        test("should preserve the wizard step and open it up starting from the last page", async () => {
            const firstStepHeader = wizardDialog.getHeader(0);

            await firstStepHeader.click();
            await wizardDialog.moveToFinalStep();

            const finishButton = wizardDialog.footer.getLocator().locator(".complete");
            await finishButton.click();

            await openWizardDialogBtn.click();

            const lastHeader = wizardDialog.getHeader(3);
            await lastHeader.toContainClass("nui-wizard-step-header--selected");

            await Helpers.pressKey("Escape");
        });
    });

    test.describe("wizard with dynamic steps > ", () => {
        let addButton: ButtonAtom;
        

        test.beforeEach(async () => {
            await wizardDynamic.toBeVisible();
            addButton = new ButtonAtom(
                wizardDynamic.getStep(0).getLocator().locator(".nui-button.add")
            );
        });

        test("should add a step dynamically", async () => {
            const stepCount = await wizardDynamic.headers.count();
            await addButton.click();
            await expect(wizardDynamic.headers.nth(0)).toBeVisible();
            await expect(wizardDynamic.headers.nth(1)).toBeVisible();
            await expect(wizardDynamic.headers).toHaveCount(stepCount + 1);
        });

        test("should remove a dynamically added step", async () => {
            const stepCount = await wizardDynamic.headers.count();

            await addButton.click();
            await expect(wizardDynamic.headers).toHaveCount(stepCount + 1);

            await removeStepBtn.click();
            await expect(wizardDynamic.headers).toHaveCount(stepCount);
        });
    });
});
