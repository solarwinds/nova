import { browser, by, element, ElementFinder, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { ComboboxV2Atom } from "./combobox-v2.atom";

describe("USERCONTROL Combobox >", () => {
    let comboboxBasic: ComboboxV2Atom;
    let comboboxError: ComboboxV2Atom;
    let comboboxForm: ComboboxV2Atom;
    let comboboxSingle: ComboboxV2Atom;
    let comboboxMulti: ComboboxV2Atom;
    let comboboxCustomControl: ComboboxV2Atom;
    let comboboxDisabled: ComboboxV2Atom;
    let comboboxValueRemoval: ComboboxV2Atom;

    let disableButton: ElementFinder;
    let showButton: ElementFinder;
    let hideButton: ElementFinder;
    let toggleButton: ElementFinder;

    let focusdrop: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("combobox-v2/test");
        comboboxBasic = Atom.find(ComboboxV2Atom, "basic");
        comboboxError = Atom.find(ComboboxV2Atom, "error");
        comboboxForm = Atom.find(ComboboxV2Atom, "form");
        comboboxSingle = Atom.find(ComboboxV2Atom, "single");
        comboboxMulti = Atom.find(ComboboxV2Atom, "multi");
        comboboxCustomControl = Atom.find(ComboboxV2Atom, "custom-control");
        comboboxDisabled = Atom.find(ComboboxV2Atom, "disabled");
        comboboxValueRemoval = Atom.find(ComboboxV2Atom, "removal");

        disableButton = element(by.id("trigger-disabled"));
        showButton = element(by.id("show"));
        hideButton = element(by.id("hide"));
        toggleButton = element(by.id("toggle"));

        focusdrop = element(by.className("focus-drop"));
    });

    describe("combobox V2 >", () => {

        describe("keyboard navigation", () => {

            beforeEach(async () => {
                await Helpers.pressKey(Key.TAB);
            });

            afterEach(async () => {
                await focusdrop.click();
            });

            it("should toggle", async () => {
                await expect(await comboboxError.isOpened()).toBe(true);
            });

            it("should only one item be active", async () => {
                await expect(await comboboxError.getActiveItemsCount()).toBe(1);
            });

            it("should navigate with UP and DOWN buttons", async () => {
                await Helpers.pressKey(Key.DOWN, 5);
                await expect(await (await comboboxError.getOption(5)).isActive()).toBe(true);

                await Helpers.pressKey(Key.UP);
                await expect(await (await comboboxError.getOption(4)).isActive()).toBe(true);
            });

            it("should close on focus out", async () => {
                await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB));
                await expect(await comboboxError.isOpened()).toBe(false);
            });

            it("should close on ESC button", async () => {
                await Helpers.pressKey(Key.ESCAPE);
                await expect(await comboboxError.isOpened()).toBe(false);
            });

            it("should open on up DOWN button", async () => {
                await Helpers.pressKey(Key.ESCAPE);
                await Helpers.pressKey(Key.DOWN);
                await expect(await comboboxError.isOpened()).toBe(true);
            });

            it("should select on ENTER", async () => {
                await Helpers.pressKey(Key.DOWN, 2);
                await Helpers.pressKey(Key.ENTER);

                await expect(await comboboxError.isOpened()).toBe(false, "Popup wasn't closed after selection!");
                await expect(await comboboxError.getInputValue()).toEqual("Item 2");
            });

            it("should reach the bottom of the list on PAGE_DOWN button pressed", async () => {
                const lastItemText = await (await comboboxError.getLastOption()).getElement().getText();
                await Helpers.pressKey(Key.PAGE_DOWN);
                await Helpers.pressKey(Key.ENTER);

                await expect(await comboboxError.getInputValue()).toEqual(lastItemText);
            });

            it("should reach the bottom of the list on PAGE_UP button pressed", async () => {
                const firstItemText = await (await comboboxError.getFirstOption()).getElement().getText();
                await Helpers.pressKey(Key.PAGE_DOWN);
                await Helpers.pressKey(Key.PAGE_UP);
                await Helpers.pressKey(Key.ENTER);

                await expect(await comboboxError.getInputValue()).toEqual(firstItemText);
            });

            it("should be able to navigate through the items if toggled using the toggle button", async () => {
                await focusdrop.click();
                await (await comboboxError.getFirstOption()).click();
                await comboboxError.toggleButton.click();
                await Helpers.pressKey(Key.DOWN, 3);
                await Helpers.pressKey(Key.UP, 1);
                await expect(await (await comboboxError.getOption(2)).getText()).toEqual("Item 2");
            });

            it("shouldn't select a typed in option on press Tab key ", async () => {
                await (await comboboxError.getFirstOption()).click();
                await comboboxError.toggleButton.click();
                await comboboxError.input.sendKeys("Item 11");
                await Helpers.pressKey(Key.TAB);

                await expect(await comboboxError.getInputValue()).toEqual("Item 0");
            });
        });

        describe("basic actions", () => {
            beforeAll(async () => {
                await browser.refresh();
            });

            it("should select input text if clicked on toggle button", async () => {
                await (await comboboxBasic.getFirstOption()).click();
                await comboboxBasic.toggleButton.click();
                await expect(await comboboxBasic.getSelectionRange()).toBeGreaterThan(0);
            });

            it("should drop selection on click", async () => {
                await comboboxBasic.click();
                await expect(await comboboxBasic.getSelectionRange()).toEqual(0);
            });

            it("should scroll to active option on click", async () => {
                await comboboxBasic.click();

                const option = await comboboxBasic.getOption(50);

                await option.click();
                await comboboxBasic.click();

                // Detect when option within a scrollable div are in view
                // https://stackoverflow.com/questions/16308037/detect-when-elements-within-a-scrollable-div-are-out-of-view
                const containerHeight = (await comboboxBasic.getPopupElement().getSize()).height;
                const containerTop = +await comboboxBasic.getPopupElement().getAttribute("scrollTop");
                const optionTop = +await (option).getElement().getAttribute("offsetTop");

                const isOptionVisibleInScrollBox = (optionTop > containerTop) && (optionTop < (containerTop + containerHeight));

                await expect(isOptionVisibleInScrollBox).toBeTruthy();
            });
        });

        describe("should popup follow the dimensions of its toggle reference", () => {
            beforeAll(async () => {
                await browser.refresh();
            });

            afterEach(async () => {
                const comboboxWidth = (await comboboxCustomControl.getElement().getSize()).width;
                const overlayWidth = (await comboboxCustomControl.getPopupElement().getSize()).width;
                await expect(comboboxWidth).toEqual(overlayWidth);
            });

            it("should width match on initial state", async () => {
                await toggleButton.click();
            });

            it("should width match if selected items", async () => {
                await comboboxCustomControl.selectFirst(18);
            });

            it("should width match if removed items", async () => {
                await comboboxCustomControl.removeChips(10);
            });

            it("should width match if back to initial state", async () => {
                await comboboxCustomControl.removeAll();
            });
        });

        describe("selected items keyboard navigation", () => {
            beforeAll(async () => {
                await browser.refresh();
            });

            beforeEach(async () => {
                const removeButtonMulti = comboboxMulti.removeAllButton;
                const removeButtonManual = comboboxCustomControl.removeAllButton;
                if (await removeButtonMulti.isPresent()) {
                    await removeButtonMulti.click();
                }
                if (await removeButtonManual.isPresent()) {
                    await removeButtonManual.click();
                }
                await hideButton.click();
                await focusdrop.click();
            });

            it("should delete selected item on backspace", async () => {
                await comboboxMulti.selectAll();

                await expect(await comboboxMulti.chips.count()).toBe(3);

                await comboboxMulti.toggleButton.click();

                await Helpers.pressKey(Key.LEFT);
                await Helpers.pressKey(Key.BACK_SPACE, 2);

                await expect(await comboboxMulti.chips.count()).toBe(1);
            });

            it("selected item should lost focus on not allowed key keydown", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);

                await expect(await comboboxMulti.activeChip.isPresent()).toBe(true);

                await Helpers.pressKey(Key.DOWN);

                await expect(await comboboxMulti.activeChip.isPresent()).toBe(false);
            });

            it("popup should be closed on Selected Items focus in", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);

                await expect(await comboboxMulti.isOpened()).toBe(false);
            });

            it("popup should be opened on Selected Items focus out", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);
                await Helpers.pressKey(Key.RIGHT);

                await expect(await comboboxMulti.isOpened()).toBe(true);
            });

            it("selected items shouldn't be looped", async () => {
                await comboboxMulti.selectAll();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey(Key.LEFT, 7);

                await expect(await Atom.hasClass(comboboxMulti.chips.first(), "active")).toBe(true);

                await Helpers.pressKey(Key.RIGHT, 1);

                await expect(await Atom.hasClass(comboboxMulti.chips.get(1), "active")).toBe(true);
            });

            it("it should deactivate active option", async () => {
                await showButton.click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);

                await expect(await comboboxCustomControl.activeOption.isPresent()).toBe(false);
                await expect(await comboboxCustomControl.activeChip.isPresent()).toBe(true);
            });

            it("should deactivate selected options", async () => {
                await showButton.click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);
                await Helpers.pressKey(Key.DOWN);

                await expect(await comboboxCustomControl.activeChip.isPresent()).toBe(false);
                await expect(await comboboxCustomControl.activeOption.isPresent()).toBe(true);
            });

            it("shouldn't close popup on popup focus out", async () => {
                await showButton.click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey(Key.LEFT);

                await expect(await comboboxCustomControl.getPopupElement().isPresent()).toBe(true);
            });

            it("should mark the first unfiltered item as active on open in multiselect", async () => {
                await comboboxMulti.click();
                await Helpers.pressKey(Key.ENTER);
                await Helpers.pressKey(Key.DOWN);

                await expect(await (await comboboxMulti.getOption(1)).isActive()).toBe(true);
            });
        });
    });
});
