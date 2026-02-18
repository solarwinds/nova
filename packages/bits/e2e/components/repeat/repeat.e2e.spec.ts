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

import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { RepeatAtom } from "./repeat.atom";
import { SwitchAtom } from "../switch/switch.atom";
import { TabHeadingGroupAtom } from "../tab-heading-group/tab-heading-group.atom";
import { TabHeadingAtom } from "../tab-heading-group/tab-heading.atom";


test.describe("USERCONTROL Repeat", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("repeat/repeat-test", page);
    });

    const getTabByText = async (text: string): Promise<TabHeadingAtom> =>
        {
            const s = Atom.find<TabHeadingGroupAtom>(TabHeadingGroupAtom, "repeat-test-tab-group")
            await expect(s.getLocator()).toBeVisible();
            return s.getTabByText(
                    text
                );
        };
    const getList = (id: string) => Atom.find<RepeatAtom>(RepeatAtom, id);

    const expectSelection = async (
        locator: ReturnType<typeof Helpers.page.locator>,
        text: string
    ): Promise<void> => {
        await expect(locator).toHaveText(text);
    };

    test("should render enough content to fill the full height of the virtual scroll viewport", async () => {
        await (await getTabByText("Repeat VScroll")).click();
        const vScrollList = getList("repeat-test-vscroll");
        await expect
            .poll(async () => {
                const viewport = await vScrollList.vScrollViewport.boundingBox();
                const content = await vScrollList.vScrollViewportContent.boundingBox();
                return (
                    viewport != null &&
                    content != null &&
                    viewport.height < content.height
                );
            })
            .toBe(true);
        // Return to initial state
        await (await getTabByText("No Content")).click();
    });

    test.describe("in multiselection mode", () => {
        test.describe("", () => {
            let list: RepeatAtom;
            let selection: ReturnType<typeof Helpers.page.locator>;

            test.beforeEach(() => {
                list = getList("nui-demo-multi-repeat");
                expect(list.getLocator()).toBeVisible();
                selection = Helpers.page.locator(
                    "#nui-demo-multi-repeat-values"
                );
            });

            test.beforeEach(async () => {
                await expectOriginalSelection();
            });

            test("should apply the specified padding", async () => {
                await list.toBeCompact();
            });

            const expectOriginalSelection = async () =>
                expectSelection(
                    selection,
                    `[ { "color": "yellow" }, { "color": "black" } ]`
                );

            test("should allow multi selection of items by clicking on checkbox", async () => {
                await list.selectCheckboxes(2, 5);
                await expectSelection(selection, "[]");
                await list.selectCheckboxes(0);
                await expectSelection(selection, `[ { "color": "blue" } ]`);

                // Return to initial state
                await list.selectCheckboxes(2, 5, 0);
            });

            test("should allow multi selection of items by clicking on row body", async () => {
                await list.selectRows(2, 5);
                await expectSelection(selection, "[]");
                await list.selectRows(0);
                await expectSelection(selection, `[ { "color": "blue" } ]`);

                // Return to initial state
                await list.selectRows(2, 5, 0);
            });

            test.describe("keyboard navigation", () => {
                test("should allow check/uncheck items using ENTER", async () => {
                    await list.selectRows(0, 0);
                    await Helpers.pressKey("Tab");
                    await Helpers.pressKey("Enter");
                    await expectSelection(
                        selection,
                        `[ { "color": "yellow" }, { "color": "black" }, { "color": "blue" } ]`
                    );

                    await Helpers.pressKey("Enter");
                });

                test("should allow check/uncheck items using SPACE", async () => {
                    await list.selectRows(0, 0);
                    await Helpers.pressKey("Tab");
                    await Helpers.pressKey(" ");
                    await expectSelection(
                        selection,
                        `[ { "color": "yellow" }, { "color": "black" }, { "color": "blue" } ]`
                    );

                    await Helpers.pressKey(" ");
                });
            });

            test.describe("when preventRowClick set", () => {
                let preventRowClickSwitch: SwitchAtom;

                test.beforeEach(async () => {
                    preventRowClickSwitch = Atom.find<SwitchAtom>(
                        SwitchAtom,
                        "nui-demo-multi-repeat-switch"
                    );
                    await preventRowClickSwitch.toggle();
                });

                test("should allow multi selection of items by clicking on checkbox", async () => {
                    await list.selectCheckboxes(2, 5);
                    await expectSelection(selection, `[]`);

                    await list.selectCheckboxes(1);
                    await expectSelection(
                        selection,
                        `[ { "color": "green" } ]`
                    );

                    // Return to initial state
                    await list.selectCheckboxes(2, 5, 1);
                });

                test("should not allow multi selection of items by clicking on row body", async () => {
                    await list.selectRows(2);
                    await expectOriginalSelection();
                    await list.selectRows(3);
                    await expectOriginalSelection();
                });
            });
        });

        test.describe("with disabled items", () => {
            let list: RepeatAtom;
            let colorSelection: ReturnType<typeof Helpers.page.locator>;

            test.beforeEach(() => {
                list = getList("nui-demo-multi-repeat-disabled");
                colorSelection = Helpers.page.locator(
                    "#nui-demo-multi-repeat-disabled-values"
                );
            });

            const expectOriginalSelection = async () =>
                expectSelection(
                    colorSelection,
                    `[ { "color": "blue", "disabled": true }, { "color": "black" } ]`
                );

            test("should not allow multi selection of disabled items by clicking on checkbox", async () => {
                await expectOriginalSelection();
                await list.selectCheckbox(0);
                await expectOriginalSelection();
                await list.selectCheckbox(4);
                await expectOriginalSelection();
            });

            test("should not allow multi selection of disabled items by clicking on row body", async () => {
                await expectOriginalSelection();
                await list.selectRow(0);
                await expectOriginalSelection();
                await list.selectRow(4);
                await expectOriginalSelection();
            });
        });
    });

    test.describe("in single select mode", () => {
        let list: RepeatAtom;
        let selection: ReturnType<typeof Helpers.page.locator>;

        const valueDec = `[ { "name": "Declan McGregor", "level": "platinum", "status": "active" } ]`;
        const valueJo = `[ { "name": "Jo Smith", "level": "bronze", "status": "active" } ]`;
        const valueCat = `[ { "name": "Catriona Kildare", "level": "gold", "status": "active" } ]`;

        test.beforeEach(() => {
            list = getList("nui-demo-single-repeat");
            selection = Helpers.page.locator("#nui-demo-singleselect-value");
        });

        test("should apply the specified padding", async () => {
            // Needs to be compact by default
            await list.toBeCompact();
        });

        test("should allow single selection of items", async () => {
            await expectSelection(selection, valueDec);
            await list.selectRow(0);
            await expectSelection(selection, valueJo);
            await list.selectRow(4);
            await expectSelection(selection, valueCat);

            // Return to initial state
            await list.selectRow(2);
            await expectSelection(selection, valueDec);
        });

        test.describe("should work properly with disabled items", async () => {
            test("should not select a disabled item", async () => {
                await list.selectRow(0);
                await expectSelection(selection, valueJo);
                await list.selectRow(1);
                await expectSelection(selection, valueJo);
            });

            test("should change the cursor type to a correct one on hover", async () => {
                const disabledItem = list.getItem(1);
                await list.hover(disabledItem);
                await expect(disabledItem).toHaveCSS("cursor", "not-allowed");
            });
        });
    });

    test.describe("in radio selection mode", () => {
        let list: RepeatAtom;
        let selection: ReturnType<typeof Helpers.page.locator>;

        test.beforeEach(() => {
            list = getList("nui-demo-radio-repeat");
            selection = Helpers.page.locator("#nui-demo-radioselect-value");
        });

        test("should allow radio selection of items", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRadio(3);
            await expectSelection(selection, `[ { "color": "cyan" } ]`);
            await list.selectRadio(5);
            await expectSelection(selection, `[ { "color": "black" } ]`);

            // Return to initial state
            await list.selectRadio(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        test("should detect itemSource change and display new items", async () => {
            const addColorButton = Helpers.page.locator("#add-color");
            await expect(addColorButton).toContainText("Add color");
            await addColorButton.click();
            await expect(list.items.last()).toContainText("new color");
        });
    });

    test.describe("in radio selection mode (non required selection)", () => {
        let list: RepeatAtom;
        let selection: ReturnType<typeof Helpers.page.locator>;

        test.beforeEach(() => {
            list = getList("nui-demo-radio-non-required-selection-repeat");
            selection = Helpers.page.locator(
                "#nui-demo-radio-non-required-selection-repeat-value"
            );
        });

        test("should allow select/unselect by clicking row", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRow(1);
            await expectSelection(selection, `[]`);
            await list.selectRow(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        test("should allow select/unselect by clicking radio button", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRadio(1);
            await expectSelection(selection, `[]`);
            await list.selectRadio(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        test("should show not-allowed cursor on hover over disabled items", async () => {
            const disabledNonRequiredItem = list.getItem(0);
            await list.hover(disabledNonRequiredItem);
            await expect(disabledNonRequiredItem).toHaveCSS(
                "cursor",
                "not-allowed"
            );
        });

        test.describe("when preventRowClick set", () => {
            let preventRowClickSwitch: SwitchAtom;

            test.beforeEach(async () => {
                preventRowClickSwitch = Atom.find<SwitchAtom>(
                    SwitchAtom,
                    "nui-demo-radio-non-required-selection-repeat-switch"
                );
                await preventRowClickSwitch.toggle();
            });

            test("should not allow select/unselect by clicking row", async () => {
                await expectSelection(selection, `[ { "color": "green" } ]`);
                await list.selectRow(1);
                await expectSelection(selection, `[ { "color": "green" } ]`);
            });

            test("should allow select/unselect by clicking radio button", async () => {
                await expectSelection(selection, `[ { "color": "green" } ]`);
                await list.selectRadio(1);
                await expectSelection(selection, `[]`);
                await list.selectRadio(1);
                await expectSelection(selection, `[ { "color": "green" } ]`);
            });
        });
    });
});
