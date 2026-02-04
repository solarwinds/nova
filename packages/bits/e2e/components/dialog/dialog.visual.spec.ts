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

import { DialogAtom } from "./dialog.atom";
import { Atom } from "../../atom";
import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { SelectAtom } from "../select/select.atom";

const name: string = "Dialog";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;

    let buttonCriticalDialog: Atom;
    let buttonWarningDialog: Atom;
    let buttonInfoDialog: Atom;
    let buttonMediumDialog: Atom;
    let buttonLargeDialog: Atom;
    let buttonCustomHeaderDialog: Atom;
    let buttonConfirmationDialogOverrides: Atom;
    let buttonConfirmationDialogDefaults: Atom;
    let buttonLongDialog: Atom;
    let buttonResponsiveDialog: Atom;
    let select: SelectAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        buttonCriticalDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-critical-dialog-btn"
        );
        buttonWarningDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-warning-dialog-btn"
        );
        buttonInfoDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-info-dialog-btn"
        );
        buttonMediumDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-medium-dialog-btn"
        );
        buttonLargeDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-large-dialog-btn"
        );
        buttonCustomHeaderDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-custom-actions-dialog-btn"
        );
        buttonConfirmationDialogOverrides = Atom.find<Atom>(
            Atom,
            "nui-visual-test-confirmation-dialog-overrides-btn"
        );
        buttonConfirmationDialogDefaults = Atom.find<Atom>(
            Atom,
            "nui-visual-test-confirmation-dialog-defaults-btn"
        );
        buttonLongDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-long-dialog-btn"
        );
        buttonResponsiveDialog = Atom.find<Atom>(
            Atom,
            "nui-visual-test-responsive-dialog-btn"
        );

        select = Atom.find<SelectAtom>(SelectAtom, "nui-visual-basic-select", true);

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await test.step("Critical dialog", async () => {
            await buttonCriticalDialog.click();
            await camera.say.cheese("Critical dialog");
            await DialogAtom.dismissDialog();
        });

        await test.step("Warning dialog", async () => {
            await buttonWarningDialog.click();
            await camera.say.cheese("Warning dialog");
            await DialogAtom.dismissDialog();
        });

        await test.step("Info dialog", async () => {
            await buttonInfoDialog.click();
            await camera.say.cheese("Info dialog");
            await DialogAtom.dismissDialog();
        });

        await test.step("Medium dialog (dark)", async () => {
            await Helpers.switchDarkTheme("on");
            await buttonMediumDialog.click();
            await camera.say.cheese("Medium dialog");
            await DialogAtom.dismissDialog();
            await Helpers.switchDarkTheme("off");
        });

        await test.step("Large dialog", async () => {
            await buttonLargeDialog.click();
            await camera.say.cheese("Large dialog");
            await DialogAtom.dismissDialog();
        });

        await test.step("Custom header dialog", async () => {
            await buttonCustomHeaderDialog.click();
            await DialogAtom.toBeVisible();
            await camera.say.cheese("Custom header dialog");
            await select.toggleMenu();
            await camera.say.cheese("Menu is toggled and has proper z-index");
            await select.toggleMenu();
            await DialogAtom.dismissDialog();
        });

        await test.step("Confirmation dialog with overrides (dark)", async () => {
            await Helpers.switchDarkTheme("on");
            await buttonConfirmationDialogOverrides.click();
            await camera.say.cheese("Confirmation dialog with overrides");
            await DialogAtom.dismissDialog();
            await Helpers.switchDarkTheme("off");
        });

        await test.step("Confirmation dialog default", async () => {
            await buttonConfirmationDialogDefaults.click();
            await camera.say.cheese("Confirmation dialog default");
            await DialogAtom.dismissDialog();
        });

        await test.step("Long content dialog (zoom)", async () => {
            await buttonLongDialog.click();
            await Helpers.browserZoom(55);
            await camera.say.cheese("Default dialog with long content");
            await Helpers.browserZoom(100);
            await DialogAtom.dismissDialog();
        });

        await test.step("Responsive-mode dialog", async () => {
            await buttonResponsiveDialog.click();
            await camera.say.cheese("Responsive-mode dialog with long content");
            await DialogAtom.dismissDialog();
        });

        await camera.turn.off();
    });
});
