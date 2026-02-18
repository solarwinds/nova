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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { test, Helpers } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { PanelAtom } from "./panel.atom";

const name: string = "Panel";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let closablePanel: PanelAtom;
    let collapsiblePanel: PanelAtom;
    let customStylesPanel: PanelAtom;
    let hoverablePanel: PanelAtom;
    let topOrientedPanel: PanelAtom;
    let nestedPanelOuter: PanelAtom;
    let resizablePanel: PanelAtom;
    let expanders: Record<string, Locator>;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("panel/panel-visual-test", page);

        collapsiblePanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-embedded-content-panel"
        );
        closablePanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-hidden-panel"
        );
        customStylesPanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-custom-styles-panel"
        );
        hoverablePanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-hoverable-panel"
        );
        topOrientedPanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-top-oriented-panel"
        );
        nestedPanelOuter = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-nested-panel-outer"
        );
        resizablePanel = Atom.find<PanelAtom>(
            PanelAtom,
            "nui-visual-test-resizable-panel"
        );

        expanders = {
            detailsBasicPanel: page.locator(
                "#nui-visual-basic-panel-details"
            ),
            detailsCustomSizes: page.locator(
                "#nui-visual-custom-size-panel-details"
            ),
            detailsHoverable: page.locator(
                "#nui-visual-hoverable-panel-details"
            ),
            detailsClosable: page.locator(
                "#nui-visual-closable-panel-details"
            ),
            detailsWithEmbeddedContent: page.locator(
                "#nui-visual-with-embedded-details"
            ),
            detailsCustomStyles: page.locator(
                "#nui-visual-custom-style-panel-details"
            ),
            detailsResizable: page.locator("#nui-visual-resizable-details"),
            detailsTopOriented: page.locator(
                "#nui-visual-top-oriented-panel-details"
            ),
            detailsNested: page.locator("#nui-visual-nested-panel-details"),
        };

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        // First we expand all expanders to check the default state of all panel cases
        for (const key of Object.keys(expanders)) {
            await expanders[key].click();
        }
        await camera.say.cheese(
            "Basic view with hover on top orienter arrow button"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        // Then we close first four expanders to hide examples we don't need for the test
        // This is done to reduce the amount of information on the screenshot and therefore
        // reduce its size.
        await expanders.detailsBasicPanel.click();
        await expanders.detailsCustomSizes.click();
        await expanders.detailsHoverable.click();

        await camera.say.cheese(
            "Expanded Closable Panel with embedded footer and header"
        );
        await expanders.detailsClosable.click();

        // Toggling outer panel, because its style previously overwritten styles of inner panel
        await nestedPanelOuter.toggle();
        await collapsiblePanel.toggle();
        await customStylesPanel.toggle();
        await resizablePanel.toggle();
        await topOrientedPanel.toggle();
        await resizablePanel.toggleIcon.hover();
        await camera.say.cheese("Expandable panes can be collapsed");

        // This closes last 4 examples that are already tested and expand ones closed in previous test
        for (const key of Object.keys(expanders)) {
            await expanders[key].click();
        }

        await closablePanel.closeSidePane();
        await hoverablePanel.hoverOnSidePane();
        await camera.say.cheese(
            "Closable paned can be closed. Hoverable panel can be hovered"
        );

        await camera.turn.off();
    });
});
