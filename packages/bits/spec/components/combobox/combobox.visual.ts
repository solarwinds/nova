import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ComboboxAtom } from "../combobox/combobox.atom";

// Quit testing the deprecated component
xdescribe("Visual tests: Combobox", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicCombobox: ComboboxAtom;
    let withPlaceholderCombobox: ComboboxAtom;
    let disabledCombobox: ComboboxAtom;
    let requiredCombobox: ComboboxAtom;
    let withGroupsCombobox: ComboboxAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("combobox/combobox-visual-test");
        basicCombobox = Atom.find(ComboboxAtom, "nui-visual-test-basic-combobox");
        withPlaceholderCombobox = Atom.find(ComboboxAtom, "nui-visual-test-combobox-with-placeholder");
        disabledCombobox = Atom.find(ComboboxAtom, "nui-visual-test-combobox-disabled");
        requiredCombobox = Atom.find(ComboboxAtom, "nui-visual-test-combobox-required");
        withGroupsCombobox = Atom.find(ComboboxAtom, "nui-visual-test-combobox-separators");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Combobox");
        await eyes.checkWindow("Default");

        await basicCombobox.toggleMenu();
        await withPlaceholderCombobox.textbox.hover();
        await eyes.checkWindow("basicCombobox is selected and Combobox with Placeholder is hovered");

        await requiredCombobox.toggleMenu();
        await requiredCombobox.getMenu().getMenuItemByIndex(1).clickItem();
        await disabledCombobox.textbox.hover();
        await eyes.checkWindow("Item2 is selected in required Combobox and disabled Combobox is hovered");

        await requiredCombobox.toggleMenu();
        await requiredCombobox.hover(requiredCombobox.getSelectedItem());
        await eyes.checkWindow("Selected MenuItem on hover");

        await requiredCombobox.hover(requiredCombobox.getMenu().getMenuItemByIndex(2).getElement());
        await eyes.checkWindow("Unselected MenuItem on hover");

        await withGroupsCombobox.toggleMenu();
        await withGroupsCombobox.acceptInput("21");
        await eyes.checkWindow("'21' was entered in Combobox with Groups");

        await eyes.close();
    }, 100000);
});
