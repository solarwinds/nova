import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { TooltipAtom } from "../../directives/public_api";
import { Helpers } from "../../helpers";
import { ProgressAtom } from "../public_api";

describe("USERCONTROL progress", () => {
    let indeterminateProgress: ProgressAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("progress");
        indeterminateProgress = Atom.find(ProgressAtom, "nui-demo-indeterminate-progress");
    });

    describe("stacked header progress", () => {
        beforeEach(async () => {
            const startBtn = element(by.id("nui-demo-indeterminate-progress-btn"));
            await browser.wait(ExpectedConditions.visibilityOf(startBtn), 3000);
            await startBtn.click();
        });

        it("bar should have value greater than 0", async () => {
            expect(await indeterminateProgress.getWidth()).toBeGreaterThan(0);
            await indeterminateProgress.cancelProgress();
        });

        it("should show cancel button when allow-cancel is true and hide when false", async () => {
            expect(await indeterminateProgress.canCancel()).toBe(true);
        });

        it("should be possible to display tooltip on close button", async () => {
            await indeterminateProgress.getCancelButton().hover();
            const buttonTooltip = Atom.findIn(TooltipAtom, element(by.className("cdk-overlay-container")));
            await buttonTooltip.waitToBeDisplayed();
            expect(await buttonTooltip.isTooltipDisplayed()).toBeTruthy();
            expect(await buttonTooltip.getTooltipText()).toContain("Cancel");
        });
    });
});
