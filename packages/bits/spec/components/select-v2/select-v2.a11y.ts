import { browser, Key } from "protractor";
import { Animations } from "../../../dist/sdk/atoms/helpers";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { SelectV2Atom } from "../public_api";

describe("a11y: select-v2", () => {
    let rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
    ];
    let selectBasic: SelectV2Atom;
    let selectErrorState: SelectV2Atom;
    let selectDisplayValueSmall: SelectV2Atom;
    let selectDisplayValue: SelectV2Atom;
    let selectGrouped: SelectV2Atom;
    let selectInForm: SelectV2Atom;
    let selectOverlayStyles: SelectV2Atom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("select-v2/test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        selectBasic = Atom.find(SelectV2Atom, "basic");
        selectErrorState = Atom.find(SelectV2Atom, "error-state");
        selectDisplayValueSmall = Atom.find(SelectV2Atom, "display-value-mw200");
        selectDisplayValue = Atom.find(SelectV2Atom, "display-value");
        selectGrouped = Atom.find(SelectV2Atom, "grouped");
        selectInForm = Atom.find(SelectV2Atom, "reactive-form");
        selectOverlayStyles = Atom.find(SelectV2Atom, "overlay-styles");
    });

    it("should check a11y of select-v2", async () => {
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.pressKey(Key.TAB, 3);
        await (await selectBasic.getOption(3)).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.switchDarkTheme("on");
        await selectErrorState.toggle();
        await (await selectErrorState.getFirstOption()).click();
        await (await selectInForm.getLastOption()).click();
        await (await selectDisplayValue.getFirstOption()).click();
        await (await selectGrouped.getLastOption()).click();
        await (await selectDisplayValueSmall.getOption(6)).click();
        await (await selectDisplayValueSmall.getOption(3)).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.switchDarkTheme("off");
        await selectGrouped.toggle();
        await (await selectGrouped.getLastOption()).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await selectOverlayStyles.toggle();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });
});
