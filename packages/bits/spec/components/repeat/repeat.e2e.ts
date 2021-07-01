import { by, element, ElementFinder, Key } from "protractor";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { RepeatAtom, TabHeadingAtom } from "../public_api";
import { TabHeadingGroupAtom } from "../tab-heading-group/tab-heading-group.atom";

describe("USERCONTROL Repeat", () => {
    let multiSelectList: RepeatAtom;
    let singleSelectList: RepeatAtom;
    let radioSelectList: RepeatAtom;
    let radioSelectListNonRequiredSelection: RepeatAtom;
    let vScrollTabHeading: TabHeadingAtom;
    let vScrollTabHeadingNoContent: TabHeadingAtom;

    const colorSelection = element(by.id("nui-demo-multiselect-values"));

    beforeAll(async () => {
        await Helpers.prepareBrowser("repeat/repeat-test");

        multiSelectList = Atom.find(RepeatAtom, "nui-demo-multi-repeat");
        singleSelectList = Atom.find(RepeatAtom, "nui-demo-single-repeat");
        radioSelectList = Atom.find(RepeatAtom, "nui-demo-radio-repeat");
        vScrollTabHeading = await Atom.find(TabHeadingGroupAtom, "repeat-test-tab-group").getTabByText("Repeat VScroll");
        vScrollTabHeadingNoContent = await Atom.find(TabHeadingGroupAtom, "repeat-test-tab-group").getTabByText("No Content");
        radioSelectListNonRequiredSelection = Atom.find(RepeatAtom, "nui-demo-radio-non-required-selection-repeat");
    });

    it("should render enough content to fill the full height of the virtual scroll viewport", async () => {
        await vScrollTabHeading.click();
        const vScrollList = Atom.find(RepeatAtom, "repeat-test-vscroll");
        expect(parseInt(await vScrollList.getVScrollViewportHeight(), 10)).toBeLessThan(parseInt(await vScrollList.getVScrollViewportContentHeight(), 10));
        // Return to initial state
        await vScrollTabHeadingNoContent.click();
    });

    it("should apply the specified padding", async () => {
        // Needs to be compact by default
        expect(await multiSelectList.isCompact()).toEqual(true);
        expect(await singleSelectList.isCompact()).toEqual(true);
    });

    it("should allow multi selection of items", async () => {
        await multiSelectList.selectCheckbox(2);
        await multiSelectList.selectCheckbox(5);
        expect(await colorSelection.getText()).toBe("[]");
        await multiSelectList.selectCheckbox(0);
        expect(await colorSelection.getText()).toBe("[ { \"color\": \"blue\" } ]");

        // Return to initial state
        await multiSelectList.selectCheckbox(2);
        await multiSelectList.selectCheckbox(5);
        await multiSelectList.selectCheckbox(0);
        expect(await colorSelection.getText()).toBe("[ { \"color\": \"yellow\" }, { \"color\": \"black\" } ]");
        await colorSelection.click();
    });

    describe("keyboard navigation", () => {
        it("should allow check/uncheck items using ENTER", async () => {
            await Helpers.pressKey(Key.TAB);
            await Helpers.pressKey(Key.ENTER);
            multiSelectList.getCheckbox(0);
            expect(await colorSelection.getText()).toBe("[ { \"color\":" +
                " \"yellow\" }, { \"color\": \"black\" }, { \"color\": \"blue\" } ]");

            await Helpers.pressKey(Key.ENTER);
            expect(await colorSelection.getText()).toBe("[ { \"color\":" +
                " \"yellow\" }, { \"color\": \"black\" } ]");

            // Return to initial state
            await colorSelection.click();
        });

        it("should allow check/uncheck items using SPACE", async () => {
            await Helpers.pressKey(Key.TAB);
            await Helpers.pressKey(Key.SPACE);
            multiSelectList.getCheckbox(0);
            expect(await colorSelection.getText()).toBe("[ { \"color\":" +
                " \"yellow\" }, { \"color\": \"black\" }, { \"color\": \"blue\" } ]");
            await Helpers.pressKey(Key.SPACE);
            expect(await colorSelection.getText()).toBe("[ { \"color\":" +
                " \"yellow\" }, { \"color\": \"black\" } ]");

            // Return to initial state
            await colorSelection.click();
        });
    });

    it("should allow single selection of items", async () => {
        const rowSelection = element(by.id("nui-demo-singleselect-value"));
        expect(await rowSelection.getText()).toContain("Declan McGregor");
        await singleSelectList.selectRow(0);
        expect(await rowSelection.getText()).toContain("Jo Smith");
        await singleSelectList.selectRow(4);
        expect(await rowSelection.getText()).toContain("Catriona Kildare");

        // Return to initial state
        await singleSelectList.selectRow(2);
        expect(await rowSelection.getText()).toContain("Declan McGregor");
    });

    describe("should work properly with disabled items", async () => {
        it("should not select a disabled item", async () => {
            await singleSelectList.selectRow(1);
            expect(await element(by.id("nui-demo-singleselect-value")).getText()).not.toContain("Claire Rogan");

            await radioSelectListNonRequiredSelection.selectRow(0);
            expect(await element(by.id("nui-demo-singleselect-nonrequired-value")).getText()).not.toContain("blue");
        });

        it("should change the cursor type to a correct one on hover", async () => {
            const disabledItem: ElementFinder = singleSelectList.getItem(1);
            await singleSelectList.hover(disabledItem);
            expect(await disabledItem.getCssValue("cursor")).toBe("not-allowed");

            const disabledNonRequiredItem: ElementFinder = radioSelectListNonRequiredSelection.getItem(0);
            await radioSelectListNonRequiredSelection.hover(disabledNonRequiredItem);
            expect(await disabledNonRequiredItem.getCssValue("cursor")).toBe("not-allowed");
        });
    });

    it("should allow radio selection of items", async () => {
        const radioSelection = element(by.id("nui-demo-radioselect-value"));
        expect(await radioSelection.getText()).toContain("green");
        await radioSelectList.selectRadioRow(3);
        expect(await radioSelection.getText()).toContain("cyan");
        await radioSelectList.selectRadioRow(5);
        expect(await radioSelection.getText()).toContain("black");

        // Return to initial state
        await radioSelectList.selectRadioRow(1);
        expect(await radioSelection.getText()).toContain("green");
    });

    it("should detect itemSource change and display new items", async () => {
        expect(await element(by.id("add-color")).getText()).toContain("Add color");
        await element(by.id("add-color")).click();
        expect(await radioSelectList.getItems().last().getText()).toContain("new color");
    });
});
