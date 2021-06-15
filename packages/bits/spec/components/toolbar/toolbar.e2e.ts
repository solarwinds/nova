import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

import { ToolbarAtom } from "./toolbar.atom";

describe("USERCONTROL toolbar: ", () => {
    let toolbar: ToolbarAtom;
    let toolbarEmbedded: ToolbarAtom;
    let toolbarSelected: ToolbarAtom;
    let resizableToolbarTextboxAtom: TextboxAtom;
    let toggleItemButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("toolbar/toolbar-test");
        toolbar = Atom.find(ToolbarAtom, "nui-toolbar-test");
        toolbarEmbedded = Atom.find(ToolbarAtom, "nui-toolbar-test-embedded");
        toolbarSelected = Atom.find(ToolbarAtom, "nui-toolbar-test-selection");
        resizableToolbarTextboxAtom = Atom.find(TextboxAtom, "nui-toolbar-test-input");
        toggleItemButton = Atom.find(ButtonAtom, "nui-toolbar-test-toggle-selected-item");
    });


    it("should toolbar is present ", async () => {
        expect(await toolbar.isPresent()).toBe(true);
    });

    it("should toolbar-item visible", async () => {
        expect(await toolbar.getAllVisibleItemsCount()).toBe(8);
    });

    it("should last item has 'More' title", async () => {
        expect(await toolbar.getToolbarMenu().getElement().getText()).toBe("More");
    });

    it("should have hidden items in menu", async () => {
        // There are 4 items in menu and 1 menu header
        await toolbar.popup.open();
        expect(await toolbar.getToolbarMenu().itemCount()).toBe(4);
    });

    xit("should colored destructive toolbar-item in red", async () => {
        await toolbar.popup.open();
        const deleteButton = toolbar.getToolbarMenu().getMenuItemByContainingText("delete");
        expect(deleteButton.getElement().getCssValue("color")).toBe("rgba(17, 17, 17, 1)");
    });

    it("should colored primary toolbar-item in blue", async () => {
        expect(await toolbar.getToolbarItemButton(0).getBackgroundColor()).toBe("rgba(0, 121, 170, 1)");
    });

    describe("selection mode in toolbar", () => {

        it("should change background color when selected mode on", async () => {
            expect(await toolbarSelected.getToolbarBackground()).toBe("rgba(0, 196, 210, 0.1)");
        });

        it("should contain text", async () => {
            expect(await toolbarSelected.getSelectedStateText()).toBe("1 of 72 selected");
        });

        it("should track child items changes if they are using ngIf", async () => {
            expect(await toolbarSelected.getToolbarItemButton(1).getText()).toEqual("Add First");
            await toggleItemButton.click();
            expect(await toolbarSelected.getToolbarItemButton(1).getText()).toEqual("Add Second");
        });
    });

    describe("embedded content in toolbar", () => {

        it("should contain search", async () => {
            expect(await toolbarEmbedded.getElement().element(by.className("nui-search")).isPresent()).toBeTruthy();
        });

        it("should contain menu", async () => {
            expect(await toolbarEmbedded.getElement().element(by.css(".nui-toolbar-content__embedded > .nui-menu")).isPresent()).toBeTruthy();
        });
    });

    describe("resize event in toolbar", () => {
        beforeEach(async() => {
            await resizableToolbarTextboxAtom.clearText();
        });

        it("should toolbar resized and change visible items to 5", async () => {
            const width = "500";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait( async () => toolbarItems !== await toolbar.getAllVisibleItemsCount(), 500);
            expect(await toolbar.getAllVisibleItemsCount()).toBe(5);
        });

        it("should toolbar resized and change visible items to 2", async () => {
            const width = "300";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait( async () => toolbarItems !== await toolbar.getAllVisibleItemsCount(), 500);
            expect(await toolbar.getAllVisibleItemsCount()).toBe(2);
        });

        it("should toolbar resized and hide all items in menu", async () => {
            const width = "100";
            const toolbarItems = await toolbar.getAllVisibleItemsCount();
            await resizableToolbarTextboxAtom.acceptText(width);
            await browser.wait( async () => toolbarItems !== 0, 500);
            await toolbar.popup.open();
            expect((await toolbar.getToolbarMenu().getItemTextArray()).length).toBe(12);
        });
    });
});
