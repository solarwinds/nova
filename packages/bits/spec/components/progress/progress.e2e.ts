import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { TooltipAtom } from "../../directives/public_api";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { ProgressAtom } from "../public_api";

describe("USERCONTROL progress", () => {
    let indeterminateProgress: ProgressAtom;
    let compactProgress: ProgressAtom;
    let compactProgressBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("progress/progress-test");
        indeterminateProgress = Atom.find(
            ProgressAtom,
            "nui-demo-indeterminate-progress"
        );
        compactProgress = Atom.find(ProgressAtom, "nui-demo-compact-progress");
        compactProgressBtn = Atom.findIn(
            ButtonAtom,
            element(by.buttonText("Start/stop progress"))
        );
    });

    describe("stacked header progress", () => {
        beforeEach(async () => {
            const startBtn = element(
                by.id("nui-demo-indeterminate-progress-btn")
            );
            await browser.wait(ExpectedConditions.visibilityOf(startBtn), 3000);
            await startBtn.click();
        });

        it("should show cancel button when allow-cancel is true and progress run and hide when cancel button clicked", async () => {
            expect(await indeterminateProgress.canCancel()).toBe(true);
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });

        it("should be possible to display tooltip on close button", async () => {
            await indeterminateProgress.getCancelButton().hover();
            const buttonTooltip = Atom.findIn(
                TooltipAtom,
                element(by.className("cdk-overlay-container"))
            );
            await buttonTooltip.waitToBeDisplayed();
            expect(await buttonTooltip.isTooltipDisplayed()).toBeTruthy();
            expect(await buttonTooltip.getTooltipText()).toContain("Cancel");
            // Return to initial state
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });
    });

    describe("compact progress", () => {
        beforeEach(async () => {
            await compactProgressBtn.click();
        });

        it("should show and hide progress bar when click button in compact progress", async () => {
            expect(await compactProgress.isProgressBarDisplayed()).toBe(true);
            await compactProgressBtn.click();
            expect(await compactProgress.isDisplayed()).toBe(false);
        });
    });
});
