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

    test.describe("Hoverable keyboard access", () => {
        let panel: PanelAtom;

        test.beforeEach(async ({ page }) => {
            panel = Atom.findIn<PanelAtom>(
                PanelAtom,
                page.locator("#nui-demo-keyboard-hoverable-panel")
            );
            await page.mouse.move(0, 0);
        });

        test.describe("LTR keyboard resizing", () => {
            for (const orientation of ["left", "right", "top"]) {
                for (const theme of ["light", "dark", "forced-colors"]) {
                    test(`should resize the ${orientation} panel with keyboard-only focus in ${theme}`, async ({
                        page,
                    }) => {
                        await page.emulateMedia({
                            forcedColors:
                                theme === "forced-colors" ? "active" : "none",
                        });
                        await page.evaluate(dark => {
                            document.documentElement.classList.toggle(
                                "dark-nova-theme",
                                dark
                            );
                        }, theme === "dark");
                        const panel = page.locator(
                            `#keyboard-resize-${orientation}`
                        );
                        const pane = panel.locator(".nui-panel__side-pane");
                        const separator = panel.getByRole("separator", {
                            name: `Resizable ${orientation}`,
                            exact: true,
                        });
                        const before = page.locator(
                            `#resize-before-${orientation}`
                        );
                        await before.click();
                        await separator.hover();
                        const pointerAppearance = await separator.screenshot({
                            animations: "disabled",
                        });
                        await separator.click();
                        expect(
                            (
                                await separator.screenshot({
                                    animations: "disabled",
                                })
                            ).equals(pointerAppearance)
                        ).toBe(true);
                        expect(
                            await separator.evaluate(element =>
                                element.matches(":focus-visible")
                            )
                        ).toBe(false);
                        if (orientation === "right") {
                            await before.focus();
                        } else {
                            await panel
                                .getByRole("button", { name: "Pane action" })
                                .focus();
                        }
                        await page.keyboard.press("Tab");
                        await expect(separator).toBeFocused();
                        await expect(separator).toHaveCSS(
                            "outline-style",
                            "solid"
                        );
                        await expect(separator).toHaveCSS(
                            "outline-width",
                            "2px"
                        );
                        await expect(separator).toHaveCSS(
                            "outline-offset",
                            "-2px"
                        );
                        expect(
                            (
                                await separator.screenshot({
                                    animations: "disabled",
                                })
                            ).equals(pointerAppearance)
                        ).toBe(false);
                        await expect(separator).toHaveAttribute(
                            "aria-controls",
                            (await pane.getAttribute("id"))!
                        );
                        await expect(separator).toHaveAttribute(
                            "aria-orientation",
                            orientation === "top" ? "horizontal" : "vertical"
                        );
                        const oldPane = await pane.boundingBox();
                        const oldSeparator = await separator.boundingBox();
                        const grow =
                            orientation === "left"
                                ? "ArrowRight"
                                : orientation === "right"
                                ? "ArrowLeft"
                                : "ArrowDown";
                        await page.keyboard.press(grow);
                        const axis = orientation === "top" ? "height" : "width";
                        await expect
                            .poll(async () => (await pane.boundingBox())![axis])
                            .toBeCloseTo(oldPane![axis] + 1, 1);
                        const moved = (await separator.boundingBox())!;
                        const coordinate = orientation === "top" ? "y" : "x";
                        expect(moved[coordinate]).toBeCloseTo(
                            oldSeparator![coordinate] +
                                (orientation === "right" ? -1 : 1),
                            1
                        );
                        await expect(separator).toHaveAttribute(
                            "aria-valuenow",
                            "151"
                        );
                        await expect(separator).toHaveAttribute(
                            "aria-valuetext",
                            "151 pixels"
                        );
                        await page.keyboard.press("Home");
                        await expect(separator).toHaveAttribute(
                            "aria-valuenow",
                            "100"
                        );
                        await expect
                            .poll(async () => (await pane.boundingBox())![axis])
                            .toBeCloseTo(100, 1);
                        const maximum = Number(
                            await separator.getAttribute("aria-valuemax")
                        );
                        await page.keyboard.press("End");
                        await expect(separator).toHaveAttribute(
                            "aria-valuenow",
                            String(maximum)
                        );
                        await expect
                            .poll(async () => (await pane.boundingBox())![axis])
                            .toBeCloseTo(maximum, 1);
                        await expect(separator).toBeFocused();
                        await panel
                            .getByRole("button", {
                                name: "Collapse panel",
                                exact: true,
                            })
                            .click();
                        await expect(panel.getByRole("separator")).toHaveCount(
                            0
                        );
                    });
                }
            }

            test("should keep RTL panel keyboard resizing deferred", async ({
                page,
            }) => {
                const gutter = page.locator(
                    "#keyboard-resize-rtl .nui-resize-gutter"
                );
                await expect(gutter).toBeVisible();
                await expect(gutter).not.toHaveAttribute("role", "separator");
                await expect(gutter).not.toHaveAttribute("tabindex", "0");
                await expect(gutter).not.toHaveClass(
                    /nui-resize-gutter-disabled/
                );
            });
        });

        test("should reach content with Tab and return focus on Escape", async ({
            page,
        }) => {
            await page.locator("#panel-keyboard-before").focus();
            await page.keyboard.press("Tab");
            await expect(panel.sidePane).toBeFocused();
            await panel.toBeExpanded();
            expect(
                await panel.sidePane.evaluate(element => ({
                    visible: element.matches(":focus-visible"),
                    shadow: getComputedStyle(element).boxShadow !== "none",
                }))
            ).toEqual({ visible: true, shadow: true });
            await expect(panel.sidePane).toHaveAttribute(
                "aria-label",
                "Keyboard panel"
            );
            await expect(panel.sidePane).toHaveAttribute(
                "aria-expanded",
                "true"
            );
            await page.keyboard.press("Tab");
            await expect(panel.sidePaneInput).toBeFocused();
            await page.keyboard.type("Keyboard input");
            await page.keyboard.press("Tab");
            await expect(
                panel.sidePane.getByRole("button", { name: "Panel action" })
            ).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(panel.sidePaneInput).toBeFocused();
            await page.keyboard.press("Escape");
            await panel.toBeCollapsed();
            await expect(panel.sidePane).toBeFocused();
            await expect(panel.sidePane).toHaveAttribute(
                "aria-expanded",
                "false"
            );
            await page.keyboard.press("Tab");
            await expect(page.locator("#panel-keyboard-after")).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(panel.sidePane).toBeFocused();
            await panel.toBeExpanded();
        });

        test("should keep keyboard-focused content open after mouseleave", async ({
            page,
        }) => {
            await panel.focusSidePane();
            await panel.sidePaneInput.focus();
            await panel.hoverOnSidePane();
            await page.mouse.move(0, 0);
            await page.waitForTimeout(800);
            await panel.toBeExpanded();
            await expect(panel.sidePaneInput).toBeFocused();
            await page.locator("#panel-keyboard-after").focus();
            await panel.toBeCollapsed();
        });

        test("should still expand and collapse with mouse hover alone", async ({
            page,
        }) => {
            await panel.hoverOnSidePane();
            await panel.toBeExpanded();
            await page.mouse.move(0, 0);
            await panel.toBeCollapsed();
        });
    });

    test.describe("Toggle focus", () => {
        for (const panelId of [
            "nui-demo-collapsible-panel",
            "nui-demo-floating-panel",
            "nui-demo-resizable-panel",
        ]) {
            test(`should retain focus on ${panelId} after keyboard and mouse toggles`, async ({
                page,
            }) => {
                const panel = Atom.find<PanelAtom>(PanelAtom, panelId);
                await panel.toBeVisible();
                const toggle = panel.toggleButton.first();
                let collapsed = await panel
                    .getLocator()
                    .first()
                    .evaluate(element =>
                        element.classList.contains("nui-panel--is-collapsed")
                    );

                await toggle.focus();
                for (const activation of [
                    "Enter",
                    "Enter",
                    "Space",
                    "Space",
                    "click",
                    "click",
                ]) {
                    if (activation === "click") {
                        await toggle.click();
                    } else {
                        await page.keyboard.press(activation);
                    }
                    collapsed = !collapsed;
                    if (collapsed) {
                        await panel.toBeCollapsed();
                    } else {
                        await panel.toBeExpanded();
                    }
                    await expect(toggle).toBeFocused();
                    await expect(toggle).toHaveAttribute(
                        "aria-disabled",
                        "false"
                    );
                }
            });
        }
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
            await Helpers.page.waitForTimeout(
                1000
            ); /* wait for animation to finish */
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
            await Helpers.page.waitForTimeout(
                1000
            ); /* wait for animation to finish */
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
            const oldSideBoxResized = await panelResize.sidePane.boundingBox();
            await gutter.moveLeft(200);
            const newSideBoxResized = await panelResize.sidePane.boundingBox();
            expect(oldSideBoxResized!.width).toBeGreaterThan(
                newSideBoxResized!.width
            );
        });
    });
});
