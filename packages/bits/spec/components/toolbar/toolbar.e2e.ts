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

import { browser, by } from "protractor";

import { ToolbarAtom } from "./toolbar.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { SwitchAtom } from "../public_api";
import { TextboxAtom } from "../textbox/textbox.atom";

describe("USERCONTROL toolbar: ", () => {
    let toolbar: ToolbarAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("toolbar/toolbar-test");
        toolbar = Atom.find(ToolbarAtom, "nui-toolbar-test");
    });

    it("should toolbar is present ", async () => {
        expect(await toolbar.isPresent()).toBe(true);
    });

    it("should toolbar-item visible", async () => {
        expect(await toolbar.getAllVisibleItemsCount()).toBe(8);
    });

    it("should last item has 'More' title", async () => {
        expect(await toolbar.getToolbarMenu().getElement().getText()).toBe(
            "More"
        );
    });

    it("should have hidden items in menu", async () => {
        // There are 4 items in menu and 1 menu header
        await toolbar.popup.open();
        expect(await toolbar.getToolbarMenu().itemCount()).toBe(4);
    });

    xit("should colored destructive toolbar-item in red", async () => {
        await toolbar.popup.open();
        const deleteButton = toolbar
            .getToolbarMenu()
            .getMenuItemByContainingText("delete");
        expect(deleteButton.getElement().getCssValue("color")).toBe(
            "rgba(17, 17, 17, 1)"
        );
    });

    it("should colored primary toolbar-item in blue", async () => {
        expect(await toolbar.getToolbarItemButton(0).getBackgroundColor()).toBe(
            "rgba(0, 121, 170, 1)"
        );
    });

    describe("selection mode in toolbar", () => {
        let toolbarSelected: ToolbarAtom;
        let toggleItemButton: ButtonAtom;

        beforeAll(() => {
            toolbarSelected = Atom.find(
                ToolbarAtom,
                "nui-toolbar-test-selection"
            );
            toggleItemButton = Atom.find(
                ButtonAtom,
                "nui-toolbar-test-toggle-selected-item"
            );
        });

        it("should change background color when selected mode on", async () => {
            expect(await toolbarSelected.getToolbarBackground()).toBe(
                "rgba(0, 196, 210, 0.1)"
            );
        });

        it("should contain text", async () => {
            expect(await toolbarSelected.getSelectedStateText()).toBe(
                "1 of 72 selected"
            );
        });

        it("should track child items changes if they are using ngIf", async () => {
            expect(
                await toolbarSelected.getToolbarItemButton(1).getText()
            ).toEqual("Add First");
            await toggleItemButton.click();
            expect(
                await toolbarSelected.getToolbarItemButton(1).getText()
            ).toEqual("Add Second");
        });
    });

    describe("embedded content in toolbar", () => {
        let toolbarEmbedded: ToolbarAtom;

        beforeAll(async () => {
            toolbarEmbedded = Atom.find(
                ToolbarAtom,
                "nui-toolbar-test-embedded"
            );
        });

        it("should contain search", async () => {
            expect(
                await toolbarEmbedded
                    .getElement()
                    .element(by.className("nui-search"))
                    .isPresent()
            ).toBeTruthy();
        });

        it("should contain menu", async () => {
            expect(
                await toolbarEmbedded
                    .getElement()
                    .element(
                        by.css(".nui-toolbar-content__embedded > .nui-menu")
                    )
                    .isPresent()
            ).toBeTruthy();
        });
    });

    describe("resize event in toolbar", () => {
        let resizableToolbarTextboxAtom: TextboxAtom;

        beforeAll(() => {
            resizableToolbarTextboxAtom = Atom.find(
                TextboxAtom,
                "nui-toolbar-test-input"
            );
        });

        beforeEach(async () => {
            await resizableToolbarTextboxAtom.clearText();
        });

        it("should toolbar resized and change visible items to 5", async () => {
            const width = "500";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait(
                async () =>
                    toolbarItems !== (await toolbar.getAllVisibleItemsCount()),
                500
            );
            expect(await toolbar.getAllVisibleItemsCount()).toBe(5);
        });

        it("should toolbar resized and change visible items to 2", async () => {
            const width = "300";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait(
                async () =>
                    toolbarItems !== (await toolbar.getAllVisibleItemsCount()),
                500
            );
            expect(await toolbar.getAllVisibleItemsCount()).toBe(2);
        });

        it("should toolbar resized and hide all items in menu", async () => {
            const width = "100";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait(async () => toolbarItems !== 0, 500);
            await toolbar.popup.open();
            expect(
                (await toolbar.getToolbarMenu().getItemTextArray()).length
            ).toBe(12);
        });
    });

    describe("empty toolbar", () => {
        let toolbarEmpty: ToolbarAtom;
        let switchSelection: SwitchAtom;
        let switchItems: SwitchAtom;
        let switchExtraMessage: SwitchAtom;
        let switchNoEmptyMessage: SwitchAtom;

        beforeAll(() => {
            toolbarEmpty = Atom.find(ToolbarAtom, "nui-toolbar-test-empty");
            switchSelection = Atom.find(
                SwitchAtom,
                "nui-toolbar-test--empty--selection-enabled"
            );
            switchItems = Atom.find(
                SwitchAtom,
                "nui-toolbar-test--empty--show-items"
            );
            switchExtraMessage = Atom.find(
                SwitchAtom,
                "nui-toolbar-test--empty--show-extra-message"
            );
            switchNoEmptyMessage = Atom.find(
                SwitchAtom,
                "nui-toolbar-test--empty--no-empty-message"
            );
        });

        describe("it should correctly project messages", async () => {
            const defaultMessageNoSelection = "No actions available";
            const defaultMessageWithSelection =
                "No actions available for this selection";
            const extraMessage = "extra message";

            const cases = [
                {
                    selection: false,
                    items: true,
                    extraMessage: false,
                    expected: [],
                },
                {
                    selection: true,
                    items: true,
                    extraMessage: false,
                    expected: [],
                },
                {
                    selection: false,
                    items: true,
                    extraMessage: true,
                    expected: [extraMessage],
                },
                {
                    selection: false,
                    items: false,
                    extraMessage: false,
                    expected: [defaultMessageNoSelection],
                },
                {
                    selection: true,
                    items: false,
                    extraMessage: false,
                    expected: [defaultMessageWithSelection],
                },
                {
                    selection: false,
                    items: false,
                    extraMessage: true,
                    expected: [defaultMessageNoSelection, extraMessage],
                },
                {
                    selection: true,
                    items: false,
                    extraMessage: true,
                    expected: [defaultMessageWithSelection, extraMessage],
                },
                {
                    selection: false,
                    items: true,
                    extraMessage: false,
                    noEmptyMessage: true,
                    expected: [],
                },
                {
                    selection: true,
                    items: true,
                    extraMessage: false,
                    noEmptyMessage: true,
                    expected: [],
                },
            ];

            for (const {
                selection,
                items,
                extraMessage,
                expected,
                noEmptyMessage,
            } of cases) {
                it(`case: selection ${selection ? "enabled" : "disabled"}, ${
                    items ? "with" : "without"
                } items, ${
                    extraMessage ? "with" : "without"
                } extraMessage`, async () => {
                    await switchSelection.setState(selection);
                    await switchItems.setState(items);
                    await switchExtraMessage.setState(extraMessage);
                    await switchNoEmptyMessage.setState(
                        noEmptyMessage ?? false
                    );
                    const texts = await toolbarEmpty.getToolbarMessagesTexts();
                    expect(texts).toEqual(expected);
                });
            }
        });
    });
});
