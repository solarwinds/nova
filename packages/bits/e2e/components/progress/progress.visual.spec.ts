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
import { Atom } from "../../atom";
import { Camera } from "../../virtual-camera/Camera";
import { ProgressAtom } from "./progress.atom";
import { ButtonAtom } from "../button/button.atom";

const name: string = "Progress";

test.describe(`Visual tests: ${name}`, () => {
    let startProgressBasic: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("progress/progress-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        startProgressBasic = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-start-basic-progress",
            true
        );
    });

    test(`${name} visual test`, async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();

        await startProgressBasic.click();
        const progressLocator = page.locator(
            Atom.getSelector(ProgressAtom) ?? `.${ProgressAtom.CSS_CLASS}`
        );
        await progressLocator.first().waitFor({ state: "visible" });
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
