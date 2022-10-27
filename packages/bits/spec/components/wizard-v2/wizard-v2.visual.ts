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

import { browser, by, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";
import { WizardV2Atom } from "./wizard-v2.atom";

const name: string = "Wizard V2";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let wizard: WizardV2Atom;
    let wizardInDialog: WizardV2Atom;
    let wizardDynamic: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;
    let addDynamicStepButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/test");

        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
        wizardInDialog = Atom.find(
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
        addDynamicStepButton = Atom.find(
            ButtonAtom,
            "nui-add-step-dynamically"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await wizard.moveToFinalStep();
        await openWizardDialogBtn.click();
        await camera.say.cheese(`Wizard inside dialog`);

        await wizardInDialog.moveToFinalStep();
        await wizardInDialog.footer
            .getElement()
            .element(by.className("complete"))
            .click();
        await openWizardDialogBtn.click();
        await camera.say.cheese(`Restored wizard`);

        await wizardInDialog.footer
            .getElement()
            .element(by.className("cancel"))
            .click();
        await camera.say.cheese(`Confirmation dialog`);

        Helpers.pressKey(Key.ESCAPE);
        await clickButton(addDynamicStepButton, 20);
        await wizardDynamic.hover(wizardDynamic.rightOverflowElement);
        await wizardDynamic.rightOverflowElement.click();
        await camera.say.cheese(`Dynamic steps with overflow right`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Overflow right in Dark theme");
        await Helpers.switchDarkTheme("off");

        await wizardDynamic.getStep(0).getElement().click();
        await wizardDynamic.moveToFinalStep();
        await wizardDynamic.hover(wizardDynamic.leftOverflowElement);
        await wizardDynamic.leftOverflowElement.click();
        await camera.say.cheese(`Dynamic steps with overflow left`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Overflow left in Dark theme");
        await Helpers.switchDarkTheme("off");

        await clickButton(wizardDynamic.footer.previousButton, 14);
        await browser.manage().window().setSize(1700, 1080);
        await camera.say.cheese(`Dynamic steps with overflow responsivity`);

        await camera.turn.off();
    }, 200000);
});

async function clickButton(button: ButtonAtom, number: number) {
    if ((await button.isPresent()) && (await button.isDisplayed())) {
        if (number < 0) {
            return;
        }

        while (number) {
            await button.click();
            number--;
        }
    }
}
