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

import { ExpanderAtom } from "./expander.atom";
import { Atom } from "../../atom";
import { test, Helpers } from "../../setup";

test.describe("a11y: expander", () => {
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;
    const rulesToDisable: string[] = [
        "aria-required-children",
        "aria-dialog-name",
        "landmark-unique",
        "aria-command-name",
        "nested-interactive",
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("expander/expander-visual-test", page);
        basicExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-visual-test-expander-basic"
        );
        lineLessExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-visual-test-expander-without-border"
        );
    });

    test("should check a11y of expander", async ({ runA11yScan }) => {
        await basicExpander.toggle();
        await lineLessExpander.toggle();
        await runA11yScan(ExpanderAtom, rulesToDisable);
    });
});
