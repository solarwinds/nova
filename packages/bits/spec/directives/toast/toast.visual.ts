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

import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Toast";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let buttonAllPositions: ElementFinder;
    let buttonAdjustSize: ElementFinder;
    let buttonNoHeader: ElementFinder;
    let buttonFW: ElementFinder;
    let buttonClearAllToasts: ElementFinder;
    let buttonCallStickyToast: ElementFinder;
    let buttonToastsWithProgressBar: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("toast/toast-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        buttonAllPositions = element(by.id("nui-toast-button-all-positions"));
        buttonFW = element(by.id("nui-toast-position-fw"));
        buttonClearAllToasts = element(by.id("nui-toast-clear-all-toasts"));
        buttonCallStickyToast = element(by.id("nui-toast-sticky"));
        buttonAdjustSize = element(by.id("nui-toast-adjust-size"));
        buttonNoHeader = element(by.id("nui-toast-no-header"));
        buttonToastsWithProgressBar = element(
            by.id("nui-toast-button-all-positions-progress-bar")
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await buttonAllPositions.click();
        await camera.say.cheese("Check all positions except of full width");
        await buttonClearAllToasts.click();

        Helpers.switchDarkTheme("on");
        await buttonAllPositions.click();
        await camera.say.cheese("Dark theme");
        await buttonClearAllToasts.click();
        Helpers.switchDarkTheme("off");

        await buttonFW.click();
        await camera.say.cheese("Check full width positions");
        await buttonClearAllToasts.click();

        await buttonAdjustSize.click();
        await camera.say.cheese(
            "Check toast messages ADJUST their sizes when triggered one after another"
        );
        await buttonClearAllToasts.click();

        await buttonNoHeader.click();
        await camera.say.cheese(
            "Checking the markup uis correct if no header is selected"
        );
        await buttonClearAllToasts.click();

        await buttonCallStickyToast.click();
        await camera.say.cheese("Check sticky toast");
        await buttonClearAllToasts.click();

        await buttonToastsWithProgressBar.click();
        await camera.say.cheese("Check progress by in scope of toast");
        await buttonClearAllToasts.click();

        await camera.turn.off();
    }, 100000);
});
