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

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { PanelAtom } from "../public_api";

describe("a11y: panel", () => {
    const rulesToDisable: string[] = [];
    let expanders: { [key: string]: ElementFinder };

    beforeAll(async () => {
        await Helpers.prepareBrowser("panel/panel-visual-test");

        await Atom.wait(async () => (await Atom.findCount(PanelAtom)) === 10);

        Atom.find(PanelAtom, "nui-visual-test-embedded-content-panel");
        Atom.find(PanelAtom, "nui-visual-test-hidden-panel");
        Atom.find(PanelAtom, "nui-visual-test-custom-styles-panel");
        Atom.find(PanelAtom, "nui-visual-test-hoverable-panel");
        Atom.find(PanelAtom, "nui-visual-test-top-oriented-panel");
        Atom.find(PanelAtom, "nui-visual-test-nested-panel-outer");
        Atom.find(PanelAtom, "nui-visual-test-resizable-panel");

        expanders = {
            detailsBasicPanel: element(by.id("nui-visual-basic-panel-details")),
            detailsCustomSizes: element(
                by.id("nui-visual-custom-size-panel-details")
            ),
            detailsHoverable: element(
                by.id("nui-visual-hoverable-panel-details")
            ),
            detailsClosable: element(
                by.id("nui-visual-closable-panel-details")
            ),
            detailsWithEmbeddedContent: element(
                by.id("nui-visual-with-embedded-details")
            ),
            detailsCustomStyles: element(
                by.id("nui-visual-custom-style-panel-details")
            ),
            detailsResizable: element(by.id("nui-visual-resizable-details")),
            detailsTopOriented: element(
                by.id("nui-visual-top-oriented-panel-details")
            ),
            detailsNested: element(by.id("nui-visual-nested-panel-details")),
        };
    });

    // TO DO: NUI-6263
    xit("should check a11y of panel", async () => {
        for (const key of Object.keys(expanders)) {
            await expanders[key].click();
        }
        await assertA11y(browser, PanelAtom, rulesToDisable);
    });
});
