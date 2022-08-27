import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";
import { WizardStepAtom } from "./wizard-step.atom";
import { WizardAtom } from "./wizard.atom";

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
