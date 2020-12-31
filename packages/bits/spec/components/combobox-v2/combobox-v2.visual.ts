import { browser, by, element, ElementFinder, Key } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { ComboboxV2Atom } from "../combobox-v2/combobox-v2.atom";

describe("Visual tests: Combobox V2", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
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

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("combobox-v2/test");
        await Helpers.disableCSSAnimations(Animations.ALL);
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

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Combobox V2");

        /**
         * The following state verifies:
         * 1. error state styles
         * 2. Clear All button works
         * 3. error state styles change conditionally
         * 4. combobox works with formfield
         * 5. typeahead filtering and highlighting works
         * 6. combobox is full width by default
         * 7. hover effect styles on combobox option
         * 8. combobox expands on TAB navigation
         */
        await (await comboboxError.getFirstOption()).click();
        await comboboxError.removeAll();
        await (await comboboxForm.getLastOption()).click();
        await comboboxForm.removeAll();
        await Helpers.pressKey(Key.TAB);
        await ComboboxV2Atom.type("Item 3");
        await (await comboboxBasic.getOption(33)).hover();
        await eyes.checkWindow("State 1");

        /**
         * The following state verifies:
         * 1. the selection works with boundary values
         * 2. the filtered option can be chosen
         * 3. the disabled combobox styles
         * 4. multiselect content projection works
         * 5. multiselect expanded styles are fine
         * 6. Create Option menu appears and it's styles are fine
         * 7. Dark theme tested
         */
        Helpers.switchDarkTheme("on");
        await (await comboboxBasic.getOption(33)).click();
        await (await comboboxError.getFirstOption()).click();
        await (await comboboxForm.getLastOption()).click();
        await disableButton.click();
        await comboboxMulti.selectAll();
        await comboboxSingle.type("qwerty");
        await eyes.checkWindow("State 2");

        /**
         * The following state verifies:
         * 1. can create a new option for single select combobox
         * 2. can create a new option for multiselect combobox and it projects
         * 3. selects the input text when expanded
         * 4. can navigate to created option via keyboard
         * 5. disabled item styles are fine
         * 6. selected item hover styles are fine
         */
        Helpers.switchDarkTheme("off");
        await comboboxSingle.type("qwerty");
        await comboboxSingle.createOption.click();
        await comboboxMulti.type("qwerty");
        await comboboxMulti.createOption.click();
        await comboboxSingle.getElement().click();
        await Helpers.pressKey(Key.ARROW_UP);
        await Helpers.pressKey(Key.DOWN);
        await (await comboboxSingle.getLastOption()).hover();
        await eyes.checkWindow("State 3");

        /**
         * The following state verifies:
         * 1. no available option menu appears and have correct styles
         * 2. combobox input hover effect styles are fine
         */
        await Helpers.pressKey(Key.TAB);
        await comboboxValueRemoval.hover();
        await eyes.checkWindow("State 4");

        /**
         * The following state verifies:
         * 1. visual regression of NUI-4744
         */
        await focusdrop.click();
        await toggleButton.click();
        await comboboxCustomControl.selectFirst(24);
        await comboboxCustomControl.removeChips(1);
        await eyes.checkWindow("State 5");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 200000);
});
