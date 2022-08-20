import { by, element, ElementFinder, Key } from "protractor";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { RepeatAtom, SwitchAtom, TabHeadingAtom } from "../public_api";
import { TabHeadingGroupAtom } from "../tab-heading-group/tab-heading-group.atom";

describe("USERCONTROL Repeat", () => {
    beforeAll(async () => {
        await Helpers.prepareBrowser("repeat/repeat-test");
    });

    const getTabByText = async (text: string): Promise<TabHeadingAtom> =>
        Atom.find(TabHeadingGroupAtom, "repeat-test-tab-group").getTabByText(
            text
        );
    const getList = (id: string) => Atom.find(RepeatAtom, id);

    const expectSelection = async (
        element: ElementFinder,
        text: string
    ): Promise<void> => {
        expect(await element.getText()).toBe(text);
    };

    it("should render enough content to fill the full height of the virtual scroll viewport", async () => {
        await (await getTabByText("Repeat VScroll")).click();
        const vScrollList = getList("repeat-test-vscroll");
        expect(
            parseInt(await vScrollList.getVScrollViewportHeight(), 10)
        ).toBeLessThan(
            parseInt(await vScrollList.getVScrollViewportContentHeight(), 10)
        );
        // Return to initial state
        await (await getTabByText("No Content")).click();
    });

    describe("in multiselection mode", () => {
        describe("", () => {
            let list: RepeatAtom;
            let selection: ElementFinder;

            beforeAll(() => {
                list = getList("nui-demo-multi-repeat");
                selection = element(by.id("nui-demo-multi-repeat-values"));
            });

            beforeEach(async () => {
                await expectOriginalSelection();
            });

            afterEach(async () => {
                await selection.click();
                await expectOriginalSelection();
            });

            it("should apply the specified padding", async () => {
                expect(await list.isCompact()).toEqual(true);
            });

            const expectOriginalSelection = async () =>
                expectSelection(
                    selection,
                    `[ { "color": "yellow" }, { "color": "black" } ]`
                );

            it("should allow multi selection of items by clicking on checkbox", async () => {
                await list.selectCheckboxes(2, 5);
                await expectSelection(selection, "[]");
                await list.selectCheckboxes(0);
                await expectSelection(selection, `[ { "color": "blue" } ]`);

                // Return to initial state
                await list.selectCheckboxes(2, 5, 0);
            });

            it("should allow multi selection of items by clicking on row body", async () => {
                await list.selectRows(2, 5);
                await expectSelection(selection, "[]");
                await list.selectRows(0);
                await expectSelection(selection, `[ { "color": "blue" } ]`);

                // Return to initial state
                await list.selectRows(2, 5, 0);
            });

            describe("keyboard navigation", () => {
                it("should allow check/uncheck items using ENTER", async () => {
                    await list.selectRows(0, 0);
                    await Helpers.pressKey(Key.TAB);
                    await Helpers.pressKey(Key.ENTER);
                    await expectSelection(
                        selection,
                        `[ { "color": "yellow" }, { "color": "black" }, { "color": "blue" } ]`
                    );

                    await Helpers.pressKey(Key.ENTER);
                });

                it("should allow check/uncheck items using SPACE", async () => {
                    await list.selectRows(0, 0);
                    await Helpers.pressKey(Key.TAB);
                    await Helpers.pressKey(Key.SPACE);
                    await expectSelection(
                        selection,
                        `[ { "color": "yellow" }, { "color": "black" }, { "color": "blue" } ]`
                    );

                    await Helpers.pressKey(Key.SPACE);
                });
            });

            describe("when preventRowClick set", () => {
                let preventRowClickSwitch: SwitchAtom;

                beforeAll(async () => {
                    preventRowClickSwitch = Atom.find(
                        SwitchAtom,
                        "nui-demo-multi-repeat-switch"
                    );
                    await preventRowClickSwitch.toggle();
                });

                afterAll(async () => {
                    await preventRowClickSwitch.toggle();
                });

                it("should allow multi selection of items by clicking on checkbox", async () => {
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

                it("should not allow multi selection of items by clicking on row body", async () => {
                    await list.selectRows(2);
                    await expectOriginalSelection();
                    await list.selectRows(3);
                    await expectOriginalSelection();
                });
            });
        });

        describe("with disabled items", () => {
            let list: RepeatAtom;
            let colorSelection: ElementFinder;

            beforeAll(() => {
                list = getList("nui-demo-multi-repeat-disabled");
                colorSelection = element(
                    by.id("nui-demo-multi-repeat-disabled-values")
                );
            });

            const expectOriginalSelection = async () =>
                expectSelection(
                    colorSelection,
                    `[ { "color": "blue", "disabled": true }, { "color": "black" } ]`
                );

            it("should not allow multi selection of disabled items by clicking on checkbox", async () => {
                await expectOriginalSelection();
                await list.selectCheckbox(0);
                await expectOriginalSelection();
                await list.selectCheckbox(4);
                await expectOriginalSelection();
            });

            it("should not allow multi selection of disabled items by clicking on row body", async () => {
                await expectOriginalSelection();
                await list.selectRow(0);
                await expectOriginalSelection();
                await list.selectRow(4);
                await expectOriginalSelection();
            });
        });
    });

    describe("in single select mode", () => {
        let list: RepeatAtom;
        let selection: ElementFinder;

        const valueDec = `[ { "name": "Declan McGregor", "level": "platinum", "status": "active" } ]`;
        const valueJo = `[ { "name": "Jo Smith", "level": "bronze", "status": "active" } ]`;
        const valueCat = `[ { "name": "Catriona Kildare", "level": "gold", "status": "active" } ]`;

        beforeAll(() => {
            list = getList("nui-demo-single-repeat");
            selection = element(by.id("nui-demo-singleselect-value"));
        });

        it("should apply the specified padding", async () => {
            // Needs to be compact by default
            expect(await list.isCompact()).toEqual(true);
        });

        it("should allow single selection of items", async () => {
            await expectSelection(selection, valueDec);
            await list.selectRow(0);
            await expectSelection(selection, valueJo);
            await list.selectRow(4);
            await expectSelection(selection, valueCat);

            // Return to initial state
            await list.selectRow(2);
            await expectSelection(selection, valueDec);
        });

        describe("should work properly with disabled items", async () => {
            it("should not select a disabled item", async () => {
                await list.selectRow(0);
                await expectSelection(selection, valueJo);
                await list.selectRow(1);
                await expectSelection(selection, valueJo);
            });

            it("should change the cursor type to a correct one on hover", async () => {
                const disabledItem: ElementFinder = list.getItem(1);
                await list.hover(disabledItem);
                expect(await disabledItem.getCssValue("cursor")).toBe(
                    "not-allowed"
                );
            });
        });
    });

    describe("in radio selection mode", () => {
        let list: RepeatAtom;
        let selection: ElementFinder;

        beforeAll(() => {
            list = getList("nui-demo-radio-repeat");
            selection = element(by.id("nui-demo-radioselect-value"));
        });

        it("should allow radio selection of items", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRadio(3);
            await expectSelection(selection, `[ { "color": "cyan" } ]`);
            await list.selectRadio(5);
            await expectSelection(selection, `[ { "color": "black" } ]`);

            // Return to initial state
            await list.selectRadio(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        it("should detect itemSource change and display new items", async () => {
            expect(await element(by.id("add-color")).getText()).toContain(
                "Add color"
            );
            await element(by.id("add-color")).click();
            expect(await list.getItems().last().getText()).toContain(
                "new color"
            );
        });
    });

    describe("in radio selection mode (non required selection)", () => {
        let list: RepeatAtom;
        let selection: ElementFinder;

        beforeAll(() => {
            list = getList("nui-demo-radio-non-required-selection-repeat");
            selection = element(
                by.id("nui-demo-radio-non-required-selection-repeat-value")
            );
        });

        it("should allow select/unselect by clicking row", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRow(1);
            await expectSelection(selection, `[]`);
            await list.selectRow(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        it("should allow select/unselect by clicking radio button", async () => {
            await expectSelection(selection, `[ { "color": "green" } ]`);
            await list.selectRadio(1);
            await expectSelection(selection, `[]`);
            await list.selectRadio(1);
            await expectSelection(selection, `[ { "color": "green" } ]`);
        });

        it("should show not-allowed cursor on hover over disabled items", async () => {
            const disabledNonRequiredItem = list.getItem(0);
            await list.hover(disabledNonRequiredItem);
            expect(await disabledNonRequiredItem.getCssValue("cursor")).toBe(
                "not-allowed"
            );
        });

        describe("when preventRowClick set", () => {
            let preventRowClickSwitch: SwitchAtom;

            beforeAll(async () => {
                preventRowClickSwitch = Atom.find(
                    SwitchAtom,
                    "nui-demo-radio-non-required-selection-repeat-switch"
                );
                await preventRowClickSwitch.toggle();
            });

            afterAll(async () => {
                await preventRowClickSwitch.toggle();
            });

            it("should not allow select/unselect by clicking row", async () => {
                await expectSelection(selection, `[ { "color": "green" } ]`);
                await list.selectRow(1);
                await expectSelection(selection, `[ { "color": "green" } ]`);
            });

            it("should allow select/unselect by clicking radio button", async () => {
                await expectSelection(selection, `[ { "color": "green" } ]`);
                await list.selectRadio(1);
                await expectSelection(selection, `[]`);
                await list.selectRadio(1);
                await expectSelection(selection, `[ { "color": "green" } ]`);
            });
        });
    });
});
