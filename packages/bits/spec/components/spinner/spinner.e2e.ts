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

import { performance } from "perf_hooks";

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
        expect(await spinner2.hasClass("nui-spinner__container--small")).toBe(
            true
        );
    });

    it("will respect size", async () => {
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
