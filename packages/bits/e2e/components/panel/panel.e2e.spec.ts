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

import { PanelAtom } from "./panel.atom";
import { Atom } from "../../atom";
import { ResizerAtom } from "../../directives/resizer/resizer.atom";
import { test, expect, Helpers } from "../../setup";

test.describe("USERCONTROL Panel", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("panel/panel-test", page);
    });

    test.describe("Collapsible", () => {
        let panelCollapsible: PanelAtom;

        test.beforeEach(async () => {
            panelCollapsible = Atom.find<PanelAtom>(
                PanelAtom,
                "nui-demo-collapsible-panel"
            );
        });

        test("Should toggle panel css class upon icon click", async () => {
            await panelCollapsible.toBeVisible();
            await panelCollapsible.toBeCollapsed();

            await panelCollapsible.toggle();
            await panelCollapsible.toBeExpanded();

            await panelCollapsible.toggle();
            await panelCollapsible.toBeCollapsed();
        });
    });

    test.describe("Hidden", () => {
        let panelHidden: PanelAtom;

        test.beforeEach(async () => {
            panelHidden = Atom.find<PanelAtom>(
                PanelAtom,
                "nui-demo-hidden-panel"
            );
        });

        test("should hide/unhide the left pane when hideLeftPane is toggled", async () => {
            await Helpers.page.waitForTimeout(1000); /* wait for animation to finish */
            await panelHidden.toBeVisible();
            await panelHidden.toHavePaneVisible("left");
            await panelHidden.closeSidePane();
            await panelHidden.toHavePaneHidden("left");
        });
    });

    test.describe("Floating", () => {
        let panelFloating: PanelAtom;

        test.beforeEach(async () => {
            panelFloating = Atom.find<PanelAtom>(
                PanelAtom,
                "nui-demo-floating-panel"
            );
        });

        test("should not change width of center pane while displaying floating panel", async () => {
            await panelFloating.toBeVisible();
            const oldBox = await panelFloating.centerPane.boundingBox();
            await panelFloating.hoverOnSidePane();
            const newBox = await panelFloating.centerPane.boundingBox();
            expect(oldBox!.width).toEqual(newBox!.width);
        });
    });

    test.describe("Resize", () => {
        let panelResize: PanelAtom;
        let gutter: ResizerAtom;

        test.beforeEach(async () => {
            panelResize = Atom.find<PanelAtom>(
                PanelAtom,
                "nui-demo-resizable-panel"
            );
            gutter = Atom.find<ResizerAtom>(
                ResizerAtom,
                "nui-demo-resizable-panel"
            );
            await panelResize.toBeVisible();
            await gutter.toBeVisible();
        });

        test("should make side panel bigger", async ({ page }) => {
            const gutterMoveDistance = 300;
            await page.setViewportSize({ width: 900, height: 890 });
            const oldBox = await panelResize.centerPane.boundingBox();
            await gutter.moveRight(gutterMoveDistance);
            const newBox = await panelResize.centerPane.boundingBox();
            await Helpers.page.waitForTimeout(1000); /* wait for animation to finish */
            expect(oldBox!.width).toBeCloseTo(
                newBox!.width + gutterMoveDistance,
                -1
            );
        });

        test("should make side panel smaller", async ({ page }) => {
            const gutterMoveDistance = 20;
            await page.setViewportSize({ width: 1200, height: 880 });
            const oldBox = await panelResize.centerPane.boundingBox();
            await gutter.moveLeft(gutterMoveDistance);
            const newBox = await panelResize.centerPane.boundingBox();
            expect(oldBox!.width).toBeCloseTo(
                newBox!.width - gutterMoveDistance,
                -1
            );
        });

        test("should not resize when panel is collapsed", async () => {
            const gutterMoveDistance = 300;
            await panelResize.toggle();
            await panelResize.toBeCollapsed();

            await panelResize.toggle();
            await panelResize.toBeExpanded();

            const oldBox = await panelResize.centerPane.boundingBox();
            await gutter.moveRight(gutterMoveDistance);
            const newBox = await panelResize.centerPane.boundingBox();
            expect(oldBox!.width).toBeGreaterThan(newBox!.width);

            // Return to initial state
            await gutter.moveLeft(gutterMoveDistance);
        });

        test("should correctly resize panel when its size was set in percents and window size was changed", async ({
            page,
        }) => {
            await page.setViewportSize({ width: 600, height: 880 });

            const oldSideBox = await panelResize.sidePane.boundingBox();
            await gutter.moveRight(200);
            const newSideBox = await panelResize.sidePane.boundingBox();
            expect(newSideBox!.width).toBeGreaterThan(oldSideBox!.width);

            await page.setViewportSize({ width: 1200, height: 880 });
            const oldSideBoxResized =
                await panelResize.sidePane.boundingBox();
            await gutter.moveLeft(200);
            const newSideBoxResized =
                await panelResize.sidePane.boundingBox();
            expect(oldSideBoxResized!.width).toBeGreaterThan(
                newSideBoxResized!.width
            );
        });
    });
});
