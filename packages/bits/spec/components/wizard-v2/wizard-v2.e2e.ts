import { by, Key } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { WizardV2Atom } from "./wizard-v2.atom";
import { BusyAtom, ButtonAtom } from "../..";

fdescribe("USERCONTROL WizardV2: ", () => {
    let wizard: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/wizard-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
        openWizardDialogBtn = Atom.find(ButtonAtom, "nui-wizard-dialog-trigger");
    });

    describe("by default",  () => {
        it("should has 3 steps", async () => {
            const steps = await wizard.getSteps();

            expect(steps.length).toEqual(3);
        });

        it("should header has title", async () => {
            const header = wizard.getHeader(0);
            const title = header.getLabelText();

            expect(title).toEqual("Step1");
        });

        it("should next button be presented", async () => {
            const footer = wizard.getFooter();
            const button = footer.getNextBtn();

            expect(button.isPresent()).toBeTruthy();
        });

        it("should select second step", async () => {
            const footer = wizard.getFooter();
            const btn = footer.getNextBtn();

            await wizard.selectStep(0);
            await btn.click();

            const header = wizard.getHeader(1);
            const hasClass = header.hasClass("nui-wizard-step-header--selected");

            expect(hasClass).toEqual(true);
        });
    });

    describe("wizard in dialog", () => {
        let wizard: WizardV2Atom;

        beforeEach(async () => {
            wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");

            if (!(await wizard.isPresent())) {
                await openWizardDialogBtn.click();
            }
        });

        it("should wizard be presented",  async () => {
            expect(await wizard.isPresent()).toEqual(true);
        });

        it("should show busy",  async () => {
            const footer = wizard.getFooter();
            const busyBtn = footer.getBusyBtn();
            const busy = Atom.find(BusyAtom, "nui-busy");

            await busyBtn.click();

            expect(await busy.isChildElementPresent(by.css(".nui-spinner"))).toEqual(true);
        });

        it("should not wizard be presented after cancel action",  async () => {
            const footer = wizard.getFooter();
            const cancelBtn = footer.getCancelBtn();

            await cancelBtn.click();

            expect(await wizard.isPresent()).toEqual(false);
        });
    });

    describe("restore state", () => {
        afterEach(() => {
            Helpers.pressKey(Key.ESCAPE);
        });

        it("should open dialog on last step", async () => {
            await openWizardDialogBtn.click();

            const wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
            const firstStepHeader = wizard.getHeader(0);

            await firstStepHeader.click();
            await wizard.moveToFinalStep();

            const footer = wizard.getFooter();
            const finishButton = footer.getFinishButton();

            await finishButton.click();
            await openWizardDialogBtn.click();

            const lastHeader = wizard.getHeader(3);

            expect(lastHeader.hasClass("nui-wizard-step-header--selected")).toEqual(true)
        });
    });

    describe("dynamic step", () => {
        let wizard: WizardV2Atom;

        beforeEach(() => {
            wizard = Atom.find(WizardV2Atom, "nui-wizard-horizontal-dynamic");
        });

        it("should add step", async () => {
            const stepLength = await wizard.getSteps().count();
            const addButton = wizard.getStep(0).getAddButton();

            await addButton.click();

            expect(await wizard.getSteps().count()).toEqual(stepLength + 1);
        });
    });
});
