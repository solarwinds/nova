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

import { WizardAtom } from "./wizard.atom";
import { Atom } from "../../atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = ["duplicate-id"];

test.describe("a11y: wizard", () => {
    let basicWizard: WizardAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("wizard/wizard-visual-test", page);
        basicWizard = Atom.find<WizardAtom>(WizardAtom, "nui-demo-wizard");
    });

    test("should check a11y of wizard on first step", async ({ runA11yScan }) => {
        await runA11yScan(WizardAtom, rulesToDisable);
    });

    test("should check a11y of wizard on second step", async ({ runA11yScan }) => {
        await basicWizard.next();
        await runA11yScan(WizardAtom, rulesToDisable);
    });
});
