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

import { browser, by, element, ElementFinder } from "protractor";

import { DialogAtom } from "./dialog.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { SelectAtom } from "../select/select.atom";

const name: string = "Dialog";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let buttonCriticalDialog: ElementFinder;
    let buttonWarningDialog: ElementFinder;
    let buttonInfoDialog: ElementFinder;
    let buttonMediumDialog: ElementFinder;
    let buttonLargeDialog: ElementFinder;
    let buttonCustomHeaderDialog: ElementFinder;
    let buttonConfirmationDialogOverrides: ElementFinder;
    let buttonConfirmationDialogDefaults: ElementFinder;
    let buttonLongDialog: ElementFinder;
    let buttonResponsiveDialog: ElementFinder;
    let select: SelectAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test");
        buttonCriticalDialog = element(
            by.id("nui-visual-test-critical-dialog-btn")
        );
        buttonWarningDialog = element(
            by.id("nui-visual-test-warning-dialog-btn")
        );
        buttonInfoDialog = element(by.id("nui-visual-test-info-dialog-btn"));
        buttonMediumDialog = element(
            by.id("nui-visual-test-medium-dialog-btn")
        );
        buttonLargeDialog = element(by.id("nui-visual-test-large-dialog-btn"));
        buttonCustomHeaderDialog = element(
            by.id("nui-visual-test-custom-actions-dialog-btn")
        );
        buttonConfirmationDialogOverrides = element(
            by.id("nui-visual-test-confirmation-dialog-overrides-btn")
        );
        buttonConfirmationDialogDefaults = element(
            by.id("nui-visual-test-confirmation-dialog-defaults-btn")
        );
        buttonLongDialog = element(by.id("nui-visual-test-long-dialog-btn"));
        buttonResponsiveDialog = element(
            by.id("nui-visual-test-responsive-dialog-btn")
        );
        select = Atom.find(SelectAtom, "nui-visual-basic-select");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await buttonCriticalDialog.click();
        await camera.say.cheese(`Critical dialog`);
        await DialogAtom.dismissDialog();

        await buttonWarningDialog.click();
        await camera.say.cheese(`Warning dialog`);
        await DialogAtom.dismissDialog();

        await buttonInfoDialog.click();
        await camera.say.cheese(`Info dialog`);
        await DialogAtom.dismissDialog();

        await Helpers.switchDarkTheme("on");
        await buttonMediumDialog.click();
        await camera.say.cheese(`Medium dialog`);
        await DialogAtom.dismissDialog();
        await Helpers.switchDarkTheme("off");

        await buttonLargeDialog.click();
        await camera.say.cheese(`Large dialog`);
        await DialogAtom.dismissDialog();

        await buttonCustomHeaderDialog.click();
        await camera.say.cheese(`Custom header dialog`);
        await select.toggleMenu();
        await camera.say.cheese(`Menu is toggled and has proper z-index`);
        await select.toggleMenu();
        await DialogAtom.dismissDialog();

        await Helpers.switchDarkTheme("on");
        await buttonConfirmationDialogOverrides.click();
        await camera.say.cheese(`Confirmation dialog with overrides`);
        await DialogAtom.dismissDialog();
        await Helpers.switchDarkTheme("off");

        await buttonConfirmationDialogDefaults.click();
        await camera.say.cheese(`Confirmation dialog default`);
        await DialogAtom.dismissDialog();

        await buttonLongDialog.click();
        await Helpers.browserZoom(55);
        await camera.say.cheese(`Default dialog with long content`);
        await Helpers.browserZoom(100);
        await DialogAtom.dismissDialog();

        await buttonResponsiveDialog.click();
        await camera.say.cheese(`Responsive-mode dialog with long content`);
        await DialogAtom.dismissDialog();

        await camera.turn.off();
    }, 300000);
});
