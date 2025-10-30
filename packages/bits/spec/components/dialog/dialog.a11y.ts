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

import {
    browser,
    by,
    element,
    ElementFinder,
    ExpectedConditions,
} from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { DialogAtom } from "../public_api";

describe("a11y: dialog", () => {
    // disabling the rule until NUI-6014 is addressed
    const rulesToDisable: string[] = [
        "scrollable-region-focusable", // consumers are responsible for taking care of their own content
    ];

    type ElementIdOrFinder = string | ElementFinder;

    let buttonResponsiveDialog: ElementFinder;

    const getElement = (idOrFinder: ElementIdOrFinder): ElementFinder => {
        if (typeof idOrFinder === "string") {
            return element(by.id(idOrFinder));
        }
        return idOrFinder;
    };

    const defaultAction = async () => {
        await assertA11y(browser, DialogAtom, rulesToDisable);
    };

    const verifyDialog = async (
        button: ElementIdOrFinder,
        action: () => Promise<void> = defaultAction
    ): Promise<void> => {
        await getElement(button).click();
        await action();
        await DialogAtom.dismissDialog();
    };

    beforeAll(async () => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test");

        buttonResponsiveDialog = element(
            by.id("nui-visual-test-responsive-dialog-btn")
        );

        await browser.wait(
            ExpectedConditions.visibilityOf(buttonResponsiveDialog),
            3000
        );
    });

    it("should verify a11y of critical dialog", async () => {
        await verifyDialog("nui-visual-test-critical-dialog-btn");
    });

    it("should verify a11y of warning dialog", async () => {
        await verifyDialog("nui-visual-test-warning-dialog-btn");
    });

    it("should verify a11y of info dialog", async () => {
        await verifyDialog("nui-visual-test-info-dialog-btn");
    });

    it("should verify a11y of small dialog", async () => {
        await verifyDialog("nui-visual-test-small-dialog-btn");
    });

    it("should verify a11y of medium dialog", async () => {
        await verifyDialog("nui-visual-test-medium-dialog-btn");
    });

    it("should verify a11y of large dialog", async () => {
        await verifyDialog("nui-visual-test-large-dialog-btn");
    });

    it("should verify a11y of confirmation dialog in dark theme", async () => {
        await Helpers.switchDarkTheme("on");
        await verifyDialog("nui-visual-test-confirmation-dialog-overrides-btn");
        await Helpers.switchDarkTheme("off");
    });

    it("should verify a11y of confirmation dialog in light theme", async () => {
        await verifyDialog("nui-visual-test-confirmation-dialog-defaults-btn");
    });

    it("should verify a11y of responsive dialog", async () => {
        await verifyDialog(buttonResponsiveDialog);
    });
});
