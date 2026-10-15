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

import { PanelAtom } from "./panel.atom";
import { test, Helpers, expect } from "../../setup";

test.describe("a11y: panel", () => {
    const rulesToDisable: string[] = [];

    const expanderIds = [
        "nui-visual-basic-panel-details",
        "nui-visual-custom-size-panel-details",
        "nui-visual-hoverable-panel-details",
        "nui-visual-closable-panel-details",
        "nui-visual-with-embedded-details",
        "nui-visual-custom-style-panel-details",
        "nui-visual-resizable-details",
        "nui-visual-top-oriented-panel-details",
        "nui-visual-nested-panel-details",
    ];

    let expanders: Locator[];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("panel/panel-visual-test", page);
        expanders = expanderIds.map(id => page.locator(`#${id}`));
    });

    test("should check a11y of panel", async ({ runA11yScan }) => {
        for (const expander of expanders) {
            await expander.click();
        }
        await runA11yScan(PanelAtom, rulesToDisable);
    });

    test("should expose primary content and the toggle while the sidebar is collapsed", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("panel/collapsible", page);
        const panel = page.locator("#nui-demo-collapsible-panel");
        const root = panel.locator(":scope > .nui-panel");
        const primaryContent = panel.locator(".nui-panel__center-pane p");
        const sidebarBody = panel.locator(".nui-panel__side-pane-body");
        await expect(primaryContent).toBeVisible();
        const primaryText = (await primaryContent.innerText())
            .replace(/\s+/g, " ")
            .trim();
        const session = await page.context().newCDPSession(page);
        const expectPrimaryExposure = async () => {
            await expect(primaryContent).toBeVisible();
            const { nodes } = await session.send("Accessibility.getFullAXTree");
            expect(
                nodes.some(
                    node =>
                        !node.ignored &&
                        node.role?.value === "StaticText" &&
                        node.name?.value.replace(/\s+/g, " ").trim() ===
                            primaryText
                )
            ).toBe(true);
        };

        try {
            await expect(root).toHaveClass(/nui-panel--is-collapsed/);
            await expect(sidebarBody).toHaveCount(0);
            const expandButton = panel.getByRole("button", {
                name: "Expand panel",
                exact: true,
            });
            await expect(expandButton).toBeVisible();
            await expect(expandButton).toBeEnabled();
            await expectPrimaryExposure();

            await expandButton.click();
            const collapseButton = panel.getByRole("button", {
                name: "Collapse panel",
                exact: true,
            });
            await expect(collapseButton).toBeEnabled();
            await expect(sidebarBody).toBeVisible();
            await expect(root).not.toHaveClass(/nui-panel--is-collapsed/);
            await expectPrimaryExposure();

            await collapseButton.click();
            await expect(root).toHaveClass(/nui-panel--is-collapsed/);
            await expect(sidebarBody).toHaveCount(0);
            await expect(expandButton).toBeVisible();
            await expect(expandButton).toBeEnabled();
            await expectPrimaryExposure();
        } finally {
            await session.detach();
        }
    });
});
