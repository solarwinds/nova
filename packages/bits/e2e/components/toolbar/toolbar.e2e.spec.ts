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

import { ToolbarAtom } from "./toolbar.atom";
import { Atom } from "../../atom";
import { test, expect, Helpers } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { SwitchAtom } from "../switch/switch.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

test.describe("USERCONTROL toolbar: ", () => {
    let toolbar: ToolbarAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("toolbar/toolbar-test", page);
        toolbar = Atom.find<ToolbarAtom>(ToolbarAtom, "nui-toolbar-test", true);
    });

    test("should toolbar be visible", async () => {
        await toolbar.toBeVisible();
    });

    test("should toolbar-item visible", async () => {
        await toolbar.toHaveVisibleItemsCount(8);
    });

    test("should last item has 'More' title", async () => {
        await expect(toolbar.menu.getLocator()).toHaveText("More");
    });

    test("should have hidden items in menu", async () => {
        // There are 4 items in menu and 1 menu header
        await toolbar.popup.open();
        expect(await toolbar.menu.itemCount()).toBe(4);
    });

    test("should colored destructive toolbar-item in red", async () => {
        await toolbar.popup.open();
        const deleteButton = toolbar.menu.getMenuItemByContainingText("delete");
        await expect(deleteButton.getLocator()).toHaveCSS(
            "color",
            "rgb(17, 17, 17)"
        );
    });

    test("should colored primary toolbar-item in blue", async () => {
        await expect(toolbar.getItemButton(0).getLocator()).toHaveCSS(
            "background-color",
            "rgb(0, 121, 170)"
        );
    });

    test.describe("selection mode in toolbar", () => {
        let toolbarSelected: ToolbarAtom;
        let toggleItemButton: ButtonAtom;

        test.beforeEach(async () => {
            toolbarSelected = Atom.find<ToolbarAtom>(
                ToolbarAtom,
                "nui-toolbar-test-selection",
                true
            );
            toggleItemButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-toolbar-test-toggle-selected-item",
                true
            );
        });

        test("should change background color when selected mode on", async () => {
            await expect(toolbarSelected.getLocator()).toHaveCSS(
                "background-color",
                "rgba(0, 196, 210, 0.1)"
            );
        });

        test("should contain text", async () => {
            await toolbarSelected.toHaveSelectedStateText("1 of 72 selected");
        });

        test("should track child items changes if they are using ngIf", async () => {
            await expect(
                toolbarSelected.getItemButton(1).getLocator()
            ).toHaveText("Add First");
            await toggleItemButton.click();
            await expect(
                toolbarSelected.getItemButton(1).getLocator()
            ).toHaveText("Add Second");
        });
    });

    test.describe("embedded content in toolbar", () => {
        let toolbarEmbedded: ToolbarAtom;

        test.beforeEach(async () => {
            toolbarEmbedded = Atom.find<ToolbarAtom>(
                ToolbarAtom,
                "nui-toolbar-test-embedded",
                true
            );
        });

        test("should contain search", async () => {
            await expect(
                toolbarEmbedded.getLocator().locator(".nui-search")
            ).toBeVisible();
        });

        test("should contain menu", async () => {
            await expect(
                toolbarEmbedded
                    .getLocator()
                    .locator(".nui-toolbar-content__embedded > .nui-menu")
            ).toBeVisible();
        });
    });

    test.describe("resize event in toolbar", () => {
        let resizableToolbarTextboxAtom: TextboxAtom;

        test.beforeEach(async () => {
            resizableToolbarTextboxAtom = Atom.find<TextboxAtom>(
                TextboxAtom,
                "nui-toolbar-test-input"
            );
            await resizableToolbarTextboxAtom.clearText();
        });

        test("should toolbar resized and change visible items to 5", async () => {
            await resizableToolbarTextboxAtom.acceptText("500");
            await toolbar.toHaveVisibleItemsCount(5);
        });

        test("should toolbar resized and change visible items to 2", async () => {
            await resizableToolbarTextboxAtom.acceptText("300");
            await toolbar.toHaveVisibleItemsCount(2);
        });

        test("should toolbar resized and hide all items in menu", async () => {
            await resizableToolbarTextboxAtom.acceptText("100");
            await toolbar.toHaveVisibleItemsCount(0);
            await toolbar.popup.open();
            expect(
                (await toolbar.menu.getItemTextArray()).length
            ).toBe(12);
        });
    });

    test.describe("empty toolbar", () => {
        let toolbarEmpty: ToolbarAtom;
        let switchSelection: SwitchAtom;
        let switchItems: SwitchAtom;
        let switchExtraMessage: SwitchAtom;
        let switchNoEmptyMessage: SwitchAtom;

        test.beforeEach(async () => {
            toolbarEmpty = Atom.find<ToolbarAtom>(
                ToolbarAtom,
                "nui-toolbar-test-empty",
                true
            );
            switchSelection = Atom.find<SwitchAtom>(
                SwitchAtom,
                "nui-toolbar-test--empty--selection-enabled"
            );
            switchItems = Atom.find<SwitchAtom>(
                SwitchAtom,
                "nui-toolbar-test--empty--show-items"
            );
            switchExtraMessage = Atom.find<SwitchAtom>(
                SwitchAtom,
                "nui-toolbar-test--empty--show-extra-message"
            );
            switchNoEmptyMessage = Atom.find<SwitchAtom>(
                SwitchAtom,
                "nui-toolbar-test--empty--no-empty-message"
            );
        });

        test.describe("it should correctly project messages", () => {
            const NO_SELECTION_MSG = "No actions available";
            const WITH_SELECTION_MSG =
                "No actions available for this selection";
            const EXTRA = "extra message";

            //                  [selection, items, extra, noEmpty, expected]
            const cases: [boolean, boolean, boolean, boolean, string[]][] = [
                [false, true,  false, false, []],
                [true,  true,  false, false, []],
                [false, true,  true,  false, [EXTRA]],
                [false, false, false, false, [NO_SELECTION_MSG]],
                [true,  false, false, false, [WITH_SELECTION_MSG]],
                [false, false, true,  false, [NO_SELECTION_MSG, EXTRA]],
                [true,  false, true,  false, [WITH_SELECTION_MSG, EXTRA]],
                [false, true,  false, true,  []],
                [true,  true,  false, true,  []],
            ];

            for (const [selection, items, extra, noEmpty, expected] of cases) {
                const label = [
                    `selection ${selection ? "on" : "off"}`,
                    items ? "with items" : "no items",
                    extra ? "extra msg" : null,
                    noEmpty ? "noEmptyMsg" : null,
                ].filter(Boolean).join(", ");

                test(label, async () => {
                    await switchSelection.setState(selection);
                    await switchItems.setState(items);
                    await switchExtraMessage.setState(extra);
                    await switchNoEmptyMessage.setState(noEmpty);

                    await toolbarEmpty.toHaveMessagesCount(expected.length);
                    for (let i = 0; i < expected.length; i++) {
                        await expect(
                            toolbarEmpty.messages.nth(i)
                        ).toHaveText(expected[i]);
                    }
                });
            }
        });
    });
});
