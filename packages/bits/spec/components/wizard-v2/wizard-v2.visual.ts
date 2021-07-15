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
        wizardInDialog = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
        wizardDynamic = Atom.find(WizardV2Atom, "nui-wizard-horizontal-dynamic");
        openWizardDialogBtn = Atom.find(ButtonAtom, "nui-wizard-dialog-trigger");
        addDynamicStepButton = Atom.find(ButtonAtom, "nui-add-step-dynamically");
        
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
        await wizardInDialog.footer.getElement().element(by.className("complete")).click();
        await openWizardDialogBtn.click();
        await camera.say.cheese(`Restored wizard`);

        await wizardInDialog.footer.getElement().element(by.className("cancel")).click();
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

async function clickButton (button: ButtonAtom, number: number) {
    if (await button.isPresent() && await button.isDisplayed()) {
        if (number < 0) {return}

        while (number) {
            await button.click();
            number--;
        }
    }
}
