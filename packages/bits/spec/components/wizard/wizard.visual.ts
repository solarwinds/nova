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

import { browser } from "protractor";

import { WizardStepAtom } from "./wizard-step.atom";
import { WizardAtom } from "./wizard.atom";
import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";

const name: string = "Wizard";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        basicWizard: WizardAtom,
        dialogWizard: WizardAtom,
        dialogButton: ButtonAtom,
        busyButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard/wizard-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicWizard = Atom.find(WizardAtom, "nui-demo-wizard");
        busyButton = Atom.find(ButtonAtom, "nui-demo-busy-button");
        dialogButton = Atom.find(ButtonAtom, "nui-demo-dialog-wizard-btn");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        let steps: WizardStepAtom[] = [];

        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicWizard.next();
        steps = await basicWizard.getSteps();
        await steps[0].icon.hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover first step"
        );

        await basicWizard.next();
        steps = await basicWizard.getSteps();
        await steps[1].icon.hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover second step"
        );

        await basicWizard.back();
        steps = await basicWizard.getSteps();
        await steps[2].icon.hover();
        await camera.say.cheese(
            "Steps statuses and button in footer, hover third step"
        );

        await dialogButton.click();
        dialogWizard = Atom.find(WizardAtom, "nui-demo-wizard-dialog");
        await camera.say.cheese("Default wizard in dialog");

        await dialogWizard.next();
        await camera.say.cheese("Dialog wizard switches between the steps");
        await dialogWizard.cancel();

        await busyButton.click();
        await camera.say.cheese("Wizard is busy in reduced container size");

        await camera.turn.off();
    }, 200000);
});
