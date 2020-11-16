import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";

import { WizardStepAtom } from "./wizard-step.atom";
import { WizardAtom } from "./wizard.atom";

describe("Visual tests: Wizard", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        basicWizard: WizardAtom,
        dialogWizard: WizardAtom,
        dialogButton: ButtonAtom,
        busyButton: ButtonAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("wizard/wizard-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicWizard = Atom.find(WizardAtom, "nui-demo-wizard");
        busyButton = Atom.find(ButtonAtom, "nui-demo-busy-button");
        dialogButton = Atom.find(ButtonAtom, "nui-demo-dialog-wizard-btn");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        let steps: WizardStepAtom[] = [];
        await eyes.open(browser, "NUI", "Wizard");
        await eyes.checkWindow("Default");

        await basicWizard.next();
        steps = await basicWizard.getSteps();
        await steps[0].icon.hover();
        await eyes.checkWindow("Steps statuses and button in footer, hover first step");

        await basicWizard.next();
        steps = await basicWizard.getSteps();
        await steps[1].icon.hover();
        await eyes.checkWindow("Steps statuses and button in footer, hover second step");

        await basicWizard.back();
        steps = await basicWizard.getSteps();
        await steps[2].icon.hover();
        await eyes.checkWindow("Steps statuses and button in footer, hover third step");

        await dialogButton.click();
        dialogWizard = Atom.find(WizardAtom, "nui-demo-wizard-dialog");
        await eyes.checkWindow("Default wizard in dialog");

        await dialogWizard.next();
        await eyes.checkWindow("Dialog wizard switches between the steps");
        await dialogWizard.cancel();

        await busyButton.click();
        await eyes.checkWindow("Wizard is busy in reduced container size");

        await eyes.close();
    }, 200000);
});
