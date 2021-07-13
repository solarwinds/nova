import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { WizardV2Atom } from "./wizard-v2.atom";
import { BusyAtom, ButtonAtom } from "../..";

describe("USERCONTROL WizardV2: ", () => {
    let wizard: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/wizard-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
        openWizardDialogBtn = Atom.find(ButtonAtom, "nui-wizard-dialog-trigger");
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

    describe("wizard in dialog", () => {
        beforeAll(async () => {
            await openWizardDialogBtn.click();
        });

        it("should wizard be presented",  async () => {
            const wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");

            expect(await wizard.isPresent()).toEqual(true);
        });

        it("should show busy",  async () => {
            const wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
            const footer = await wizard.getFooter();
            const busyBtn = await footer.getBusyBtn();
            const busy = Atom.find(BusyAtom, "nui-busy");

            await busyBtn.click();

            expect(await busy.isChildElementPresent(by.css(".nui-spinner"))).toEqual(true);
        });

        it("should not wizard be presented after cancel action",  async () => {
            const wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
            const footer = await wizard.getFooter();
            const cancelBtn = await footer.getCancelBtn();

            await cancelBtn.click();

            expect(await wizard.isPresent()).toEqual(false);
        });
    });

    describe("restore state", () => {
        it("should open dialog on last step", async () => {
            await openWizardDialogBtn.click();

            const wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
            const firstStepHeader = await wizard.getHeader(0);

            await firstStepHeader.click();
            await wizard.moveToFinalStep();

            const footer = await wizard.getFooter();
            const finishButton = await footer.getFinishButton();

            await finishButton.click();
            await openWizardDialogBtn.click();

            const lastHeader = await wizard.getHeader(3);

            expect(await lastHeader.hasClass("nui-wizard-step-header--selected")).toEqual(true)
        });
    });
});
