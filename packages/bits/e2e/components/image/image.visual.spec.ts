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

import { test, expect, Helpers } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Image";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("image/image-visual-test", page);
        await expect(
            page.getByRole("heading", {
                name: "Default Image View",
                exact: true,
            })
        ).toBeVisible();
        await expect(
            page.locator("#nui-demo-image-custom-alignment-container__left p")
        ).toContainText("Lorem ipsum dolor sit amet");
        await expect(page.locator("figcaption").last()).toHaveText(
            "no-search-results"
        );

        // Visible text can still have invisible glyphs while its web font loads.
        await page
            .locator("nui-image-visual-test")
            .locator("h3, p, figcaption")
            .evaluateAll(async elements => {
                const fonts = new Set(
                    elements.map(element => getComputedStyle(element).font)
                );
                for (const font of fonts) {
                    const faces = await document.fonts.load(font);
                    if (faces.length === 0) {
                        throw new Error(
                            `Image visual test could not find the web font: ${font}.`
                        );
                    }
                }
                await document.fonts.ready;
            });

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese("Default");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
