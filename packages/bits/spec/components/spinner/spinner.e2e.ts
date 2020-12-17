import { performance } from "perf_hooks";
import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, SpinnerAtom } from "../public_api";

describe("USERCONTROL Spinner", () => {
    const spinnerDelay = 500;

    const delayedSpinner: SpinnerAtom = Atom.find(SpinnerAtom, "spinner1");
    const spinner2: SpinnerAtom = Atom.find(SpinnerAtom, "spinner2");
    const delayedButton: ButtonAtom = Atom.find(ButtonAtom, "spinnerButton1");
    const button2: ButtonAtom = Atom.find(ButtonAtom, "spinnerButton2");

    beforeEach(async () => {
        await Helpers.prepareBrowser("spinner/spinner-test");
    });

    it("will be hidden when show is undefined", async () => {
        expect(await spinner2.isPresent()).toBe(false);
    });

    describe("will show/hide based on property", () => {
        it("with delayed set", async () => {
            expect(await delayedSpinner.isPresent()).toBe(false);

            await delayedButton.click();
            await delayedSpinner.waitForDisplayed(spinnerDelay * 1.5);

            await delayedButton.click();
            expect(await delayedSpinner.isPresent()).toBe(false);
        });

        it("without delay", async () => {
            expect(await spinner2.isPresent()).toBe(false);
            await button2.click();
            await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 1.5);

            await button2.click();
            expect(await spinner2.isPresent()).toBe(false);
        });
    });

    it("should have 'small' default size if no 'size' input provided", async () => {
        await button2.click();
        await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 1.5);
        expect(await spinner2.hasClass("nui-spinner__container--small")).toBe(true);
    });

    // TODO: Re-enable in scope of NUI-5576
    fit("will respect size", async () => {
        await button2.click();
        await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 1.5);

        const size = await spinner2.getSize();
        expect(size.width).toBe(20, "width");
        expect(size.height).toBe(20, "height");
    });

    it("will wait for display", async () => {
        const startPoint: number = performance.now();
        await delayedButton.click();
        expect(await delayedSpinner.isPresent()).toBe(false);

        await delayedSpinner.waitForDisplayed(spinnerDelay * 1.5);
        const endPoint: number = performance.now();

        expect(endPoint - startPoint).toBeGreaterThan(spinnerDelay);
    });

});
