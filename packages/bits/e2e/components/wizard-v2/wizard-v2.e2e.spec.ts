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

import { Page } from "@playwright/test";

import { WizardV2Atom } from "./wizard-v2.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

async function expectActivePanel(
    page: Page,
    selector: string,
    name: string
): Promise<void> {
    const activePanel = page
        .locator(selector)
        .locator("[role=tabpanel]:visible");
    await expect(activePanel).toHaveCount(1);
    await expect(activePanel).toHaveAccessibleName(name);
    const label = page.locator(
        `[id="${await activePanel.getAttribute("aria-labelledby")}"]`
    );
    await expect(label).toHaveCount(1);
    await expect(label).toHaveAttribute("aria-selected", "true");
    const panelId = await activePanel.getAttribute("id");
    if (!panelId) {
        throw new Error("The active wizard panel must have a non-empty ID.");
    }
    await expect(label).toHaveAttribute("aria-controls", panelId);

    const session = await page.context().newCDPSession(page);
    try {
        const { root } = await session.send("DOM.getDocument");
        const { nodeIds } = await session.send("DOM.querySelectorAll", {
            nodeId: root.nodeId,
            selector: `${selector} [role=tabpanel]`,
        });
        const panelIds = new Set<number>();
        for (const nodeId of nodeIds) {
            const { node } = await session.send("DOM.describeNode", { nodeId });
            panelIds.add(node.backendNodeId);
        }
        const { nodes } = await session.send("Accessibility.getFullAXTree");
        expect(
            nodes
                .filter(
                    node =>
                        !node.ignored &&
                        node.role?.value === "tabpanel" &&
                        panelIds.has(node.backendDOMNodeId!)
                )
                .map(node => node.name?.value)
        ).toEqual([name]);
        const byId = new Map(nodes.map(node => [node.nodeId, node]));
        for (const tab of nodes.filter(
            node => !node.ignored && node.role?.value === "tab"
        )) {
            let parent = byId.get(tab.parentId!);
            while (parent && parent.role?.value !== "tablist") {
                parent = byId.get(parent.parentId!);
            }
            expect(
                parent,
                `Tab ${tab.name?.value} must belong to a tablist`
            ).toBeTruthy();
        }
    } finally {
        await session.detach();
    }
}

test.describe("USERCONTROL Wizard V2: ", () => {
    let wizard: WizardV2Atom;
    let wizardDialog: WizardV2Atom;
    let wizardDynamic: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;
    let removeStepBtn: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("wizard-v2/test", page);

        wizard = Atom.find<WizardV2Atom>(
            WizardV2Atom,
            "nui-wizard-v2-horizontal",
            true
        );
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
            await wizard.footer.nextButton.getLocator().focus();
            await Helpers.pressKey("Enter");

            await wizard
                .getHeader(1)
                .toContainClass("nui-wizard-step-header--selected");
            await expect(wizard.getHeader(1).getLocator()).toBeFocused();

            await wizard.footer.backButton.getLocator().focus();
            await Helpers.pressKey("Enter");
            await expect(wizard.getHeader(0).getLocator()).toBeFocused();
        });
    });

    test.describe("accessible panels > ", () => {
        test("exposes only the selected panel and its label", async ({
            page,
        }) => {
            const selector = "#nui-wizard-v2-horizontal";
            await expectActivePanel(page, selector, "Step1");
            await wizard.next();
            await expectActivePanel(page, selector, "Step2");
            await wizard.getHeader(0).click();
            await expectActivePanel(page, selector, "Step1");
        });

        test("preserves responsive panel labels and overflow tab ownership", async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const selector = "#nui-wizard-v2-responsive-headers";
            const responsiveWizard = page.locator(selector);
            await expectActivePanel(page, selector, "Step 1");
            await responsiveWizard
                .locator(".overflow-right nui-popover")
                .focus();
            await expect(
                page.getByRole("tablist", {
                    name: "Following steps",
                    exact: true,
                })
            ).toBeVisible();
            await expectActivePanel(page, selector, "Step 1");
            await responsiveWizard.locator("[role=tabpanel]:visible").focus();
            await expect(
                page.getByRole("tablist", {
                    name: "Following steps",
                    exact: true,
                })
            ).toBeHidden();

            for (let index = 1; index < 12; index++) {
                await responsiveWizard
                    .getByRole("button", { name: "Next", exact: true })
                    .click();
            }
            await expectActivePanel(page, selector, "Step 12");
            await responsiveWizard
                .locator(".overflow-left nui-popover")
                .focus();
            await expect(
                page.getByRole("tablist", {
                    name: "Previous steps",
                    exact: true,
                })
            ).toBeVisible();
            await expectActivePanel(page, selector, "Step 12");
            await page
                .getByRole("tab", { name: /^Step 1(?: Completed)?$/ })
                .click();
            await expectActivePanel(page, selector, "Step 1");
            await responsiveWizard.locator("[role=tabpanel]:visible").focus();
            await responsiveWizard
                .locator(".overflow-right nui-popover")
                .focus();
            await page
                .getByRole("tab", { name: /^Step 12(?: Completed)?$/ })
                .click();
            await expectActivePanel(page, selector, "Step 12");
            await responsiveWizard.locator("[role=tabpanel]:visible").focus();
        });

        test("excludes inactive form controls while retaining their values", async ({
            page,
        }) => {
            await Helpers.prepareBrowser("wizard-v2/confirm-on-cancel", page);
            const selector = "nui-wizard-horizontal";
            const formWizard = page.locator(selector);
            const firstName = formWizard.locator(
                "nui-textbox[formControlName=firstName] input"
            );
            const lastName = formWizard.locator(
                "nui-textbox[formControlName=lastName] input"
            );
            const originalInput = await firstName.elementHandle();
            await expectActivePanel(page, selector, "Person Details");
            await firstName.fill("Ada");
            await lastName.fill("Lovelace");
            await lastName.focus();
            for (let index = 0; index < 8; index++) {
                await page.keyboard.press("Tab");
                expect(
                    await page.evaluate(
                        () =>
                            !!document.activeElement?.closest(
                                "[role=tabpanel][hidden]"
                            )
                    )
                ).toBe(false);
            }
            const email = formWizard.locator("input[type=email]");
            expect(
                await email.evaluate(input => {
                    input.focus();
                    return document.activeElement === input;
                })
            ).toBe(false);
            await formWizard
                .getByRole("button", { name: "Next", exact: true })
                .click();
            await expectActivePanel(page, selector, "Contact Details");
            await formWizard
                .getByRole("button", { name: "Back", exact: true })
                .click();
            await expectActivePanel(page, selector, "Person Details");
            await expect(firstName).toHaveValue("Ada");
            await expect(lastName).toHaveValue("Lovelace");
            expect(
                await firstName.evaluate(
                    (input, original) => input === original,
                    originalInput
                )
            ).toBe(true);
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
            const cancelBtn = wizardDialog.footer
                .getLocator()
                .locator(".cancel");
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

            const finishButton = wizardDialog.footer
                .getLocator()
                .locator(".complete");
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
