import { by, Key } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { WizardV2Atom } from "./wizard-v2.atom";
import { BusyAtom, ButtonAtom } from "../..";

describe("USERCONTROL Wizard V2: ", () => {
    let wizard: WizardV2Atom;
    let wizardDialog: WizardV2Atom;
    let wizardDynamic: WizardV2Atom;
    let openWizardDialogBtn: ButtonAtom;
    let removeStepBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard-v2/test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        wizard = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal");
        wizardDialog = Atom.find(WizardV2Atom, "nui-wizard-v2-horizontal-dialog");
        wizardDynamic = Atom.find(WizardV2Atom, "nui-wizard-horizontal-dynamic");
        openWizardDialogBtn = Atom.find(ButtonAtom, "nui-wizard-dialog-trigger");
        removeStepBtn = Atom.find(ButtonAtom, "nui-remove-wizard-step-button");
    });

    describe("wizard v2 > ",  () => {
        it("should have 3 steps", async () => {
            const steps = await wizard.steps;

            expect(steps.length).toEqual(3);
        });

        it("should wizard header have a title", async () => {
            expect(await wizard.getHeader(0).getLabelText()).toEqual("Step1");
        });

        it("should the next button be displayed", async () => {
            expect(await wizard.footer.nextButton.isDisplayed()).toBeTruthy();
        });

        it("should select the second step", async () => {
            await wizard.selectStep(0);
            await wizard.footer.nextButton.click();

            const hasClass = wizard.getHeader(1).hasClass("nui-wizard-step-header--selected");

            expect(hasClass).toEqual(true);
        });
    });

    describe("wizard in dialog > ", () => {
        beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        afterEach(() => {
            Helpers.pressKey(Key.ESCAPE);
        });

        it("should wizard be displayed",  async () => {
            expect(await wizardDialog.isDisplayed()).toEqual(true);
        });

        it("should show busy",  async () => {
            const busy = Atom.find(BusyAtom, "nui-busy");
            const busyTrigger = wizardDialog.getElement().element(by.id("nui-wizard-busy-btn"));

            await busyTrigger.click();

            expect(await busy.isChildElementPresent(by.css(".nui-spinner"))).toEqual(true);
        });

        it("should wizard disappear when CANCEL button is pressed",  async () => {
            const cancelBtn = wizardDialog.footer.getElement().element(by.className("cancel"));

            await cancelBtn.click();

            expect(await wizardDialog.isPresent()).toEqual(false);
        });
    });

    describe("restore wizard state > ", () => {
        beforeEach(async () => {
            await openWizardDialogBtn.click();
        });

        it("should preserve the wizard step and open it up starting from the last page", async () => {
            const firstStepHeader = wizardDialog.getHeader(0);

            await firstStepHeader.click();
            await wizardDialog.moveToFinalStep();

            const finishButton = wizardDialog.footer.getElement().element(by.className("complete"));

            await finishButton.click();
            await openWizardDialogBtn.click();

            const lastHeader = wizardDialog.getHeader(3);

            expect(await lastHeader.hasClass("nui-wizard-step-header--selected")).toEqual(true)
            await Helpers.pressKey(Key.ESCAPE);
        });
    });

    describe("wizard with dynamic steps > ", () => {
        let addButton: ButtonAtom;

        beforeEach(() => {
            addButton = new ButtonAtom(wizardDynamic.getStep(0).getElement().element(by.css(".nui-button.add")));
        });

        it("should add a step dynamically", async () => {
            const stepLength = await wizardDynamic.steps.count();

            await addButton.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength + 1);
        });

        it("should remove a dynamically added step", async () => {
            const stepLength = await wizardDynamic.steps.count();

            await addButton.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength + 1);

            await removeStepBtn.click();
            expect(await wizardDynamic.steps.count()).toEqual(stepLength);
        });
    });
});
