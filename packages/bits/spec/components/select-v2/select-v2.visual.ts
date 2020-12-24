import { browser, Key } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { SelectV2Atom } from "./select-v2.atom";

describe("Visual tests: Select V2", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let selectBasic: SelectV2Atom;
    let selectDisabled: SelectV2Atom;
    let selectErrorState: SelectV2Atom;
    let selectDisplayValueSmall: SelectV2Atom;
    let selectDisplayValue: SelectV2Atom;
    let selectGrouped: SelectV2Atom;
    let selectInForm: SelectV2Atom;
    let selectOverlayStyles: SelectV2Atom;

    beforeAll(() => {
        selectBasic = Atom.find(SelectV2Atom, "basic");
        selectDisabled = Atom.find(SelectV2Atom, "disabled");
        selectErrorState = Atom.find(SelectV2Atom, "error-state");
        selectDisplayValueSmall = Atom.find(SelectV2Atom, "display-value-mw200");
        selectDisplayValue = Atom.find(SelectV2Atom, "display-value");
        selectGrouped = Atom.find(SelectV2Atom, "grouped");
        selectInForm = Atom.find(SelectV2Atom, "reactive-form");
        selectOverlayStyles = Atom.find(SelectV2Atom, "overlay-styles");
    });

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("select-v2/test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Select V2");
        /**
         * 1. TAB navigation is working
         * 2. First element is active while tab navigating
         * 3. Hover effect over the regular item is verified
         * 4. Form field validation is triggered on focus out
         */
        await Helpers.pressKey(Key.TAB, 3);
        await (await selectBasic.getOption(3)).hover();
        await eyes.checkWindow("State 1");

        /**
         * 1. Error state is gone on items choose
         * 2. Form field validation is gone on items choose
         * 3. Display value works and accepts template data and icon
         * 4. Ellipsis works for the select options when the content is larger than the select option length
         * 5. Selected style verified
         * 6. Disabled select option styles are verified
         * 7. Hover effect on disabled item is verified
         * 8. Boundary values are successfully chosen for the regular display value example and grouped items one
         * 9. Disabled select styles checked
         * 10. Dark theme tested
         */
        await Helpers.switchDarkTheme("on");
        await selectErrorState.toggle();
        await (await selectErrorState.getFirstOption()).click();
        await (await selectInForm.getLastOption()).click();
        await (await selectDisplayValue.getFirstOption()).click();
        await (await selectGrouped.getLastOption()).click();
        await (await selectDisplayValueSmall.getOption(6)).click();
        await (await selectDisplayValueSmall.getOption(3)).hover();
        await eyes.checkWindow("State 2");
        
        /**
         * 1. Hovered selected value styles checked
         * 2. Inline selects positioning checked
         */
        await Helpers.switchDarkTheme("off");
        await selectGrouped.toggle();
        await (await selectGrouped.getLastOption()).hover();
        await eyes.checkWindow("State 3");

        /**
         * 1. Custom overlay styles are applied
         */
        // await selectGrouped.toggle();
        await selectOverlayStyles.toggle();
        await eyes.checkWindow("State 4");

        await eyes.close();
    }, 100000);
});
