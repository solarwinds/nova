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

import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Toast";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("toast/toast-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async ({ page }) => {
        const buttonAllPositions = page.locator(
            "#nui-toast-button-all-positions"
        );
        const buttonFW = page.locator("#nui-toast-position-fw");
        const buttonClearAllToasts = page.locator("#nui-toast-clear-all-toasts");
        const buttonCallStickyToast = page.locator("#nui-toast-sticky");
        const buttonAdjustSize = page.locator("#nui-toast-adjust-size");
        const buttonNoHeader = page.locator("#nui-toast-no-header");
        const buttonToastsWithProgressBar = page.locator(
            "#nui-toast-button-all-positions-progress-bar"
        );

        await camera.turn.on();

        await buttonAllPositions.click();
        await camera.say.cheese("Check all positions except of full width");
        await buttonClearAllToasts.click();

        await Helpers.switchDarkTheme("on");
        await buttonAllPositions.click();
        await camera.say.cheese("Dark theme");
        await buttonClearAllToasts.click();
        await Helpers.switchDarkTheme("off");

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
            "Checking the markup is correct if no header is selected"
        );
        await buttonClearAllToasts.click();

        await buttonCallStickyToast.click();
        await camera.say.cheese("Check sticky toast");
        await buttonClearAllToasts.click();

        await buttonToastsWithProgressBar.click();
        await camera.say.cheese("Check progress bar in scope of toast");
        await buttonClearAllToasts.click();

        await camera.turn.off();
    });
});
