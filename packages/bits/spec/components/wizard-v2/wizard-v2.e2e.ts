import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { WizardV2Atom } from "./wizard-v2.atom";

describe("USERCONTROL WizardV2: ", () => {
    let wizard: WizardV2Atom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/wizard-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
    });

    describe("by default",  () => {
        it("should wizard be preset", async () => {
            expect(await wizard.isPresent()).toBeTruthy(true);
        });

        it("should has 3 steps", async () => {
            const steps = await wizard.getSteps();

            expect(steps.length).toEqual(3);
        });

        it("should header has title", async () => {
            const header = await wizard.getHeader(0);
            const title = header.getLabelText();

            expect(title).toEqual("Step1");
        });

        it("should next button be presented", async () => {
            const footer = await wizard.getFooter();
            const button = await footer.getNextBtn();

            expect(button.isPresent()).toBeTruthy();
        });

        it("should select second step", async () => {
            const footer = await wizard.getFooter();
            const btn = await footer.getNextBtn();

            await wizard.selectStep(0);
            await btn.click();

            const header = await wizard.getHeader(1);
            const hasClass = await header.hasClass("nui-wizard-step-header--selected");

            expect(hasClass).toEqual(true);
        });
    });
});
