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

import { WizardAtom } from "./wizard.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";

const name: string = "Wizard";

test.describe(`Visual tests: ${name}`, () => {
    let basicWizard: WizardAtom;
    let dialogWizard: WizardAtom;
    let dialogButton: ButtonAtom;
    let busyButton: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("wizard/wizard-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicWizard = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard");
        busyButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-busy-button", true);
        dialogButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-dialog-wizard-btn", true);
    });

    test(`${name} visual test`, async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicWizard.next();
        await basicWizard.headerSteps.nth(0).hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover first step"
        );

        await basicWizard.next();
        await basicWizard.headerSteps.nth(1).hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover second step"
        );

        await basicWizard.back();
        await basicWizard.headerSteps.nth(2).hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover third step"
        );

        await dialogButton.click();
        dialogWizard = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard-dialog");
        await camera.say.cheese("Default wizard in dialog");

        await dialogWizard.next();
        await camera.say.cheese("Dialog wizard switches between the steps");
        await dialogWizard.cancel();

        await busyButton.click();
        await camera.say.cheese("Wizard is busy in reduced container size");

        await camera.turn.off();
    });
});
