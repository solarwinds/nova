import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { SelectAtom } from "./select.atom";

describe("Visual tests: Select", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let selectBasic: SelectAtom;
    let selectJustified: SelectAtom;
    let selectRequired: SelectAtom;
    let selectWithTemplate: SelectAtom;
    let selectWithSeparators: SelectAtom;

    beforeAll(() => {
        selectBasic = Atom.find(SelectAtom, "nui-demo-basic-select");
        selectJustified = Atom.find(SelectAtom, "nui-demo-select-justified");
        selectRequired = Atom.find(SelectAtom, "nui-demo-basic-select-required");
        selectWithTemplate = Atom.find(SelectAtom, "nui-demo-select-with-template");
        selectWithSeparators = Atom.find(SelectAtom, "nui-demo-select-separators");
    });

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("select/select-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Select");
        await eyes.checkWindow("Default");

        await selectBasic.toggleMenu();
        await eyes.checkWindow("Default items in select");
        await selectBasic.toggleMenu();

        await selectRequired.toggleMenu();
        await selectRequired.getMenu().getMenuItemByIndex(2).clickItem();
        await browser.element(by.css(`button[type = 'submit']`)).click();
        await selectRequired.getMenu().hover();
        await eyes.checkWindow("Required select");

        await selectWithSeparators.toggleMenu();
        await selectWithSeparators.getMenu().getMenuItemByIndex(2).hover();
        await eyes.checkWindow("Selector with separators and hover effects on item");
        await selectWithSeparators.toggleMenu();

        await selectWithTemplate.toggleMenu();
        await selectWithTemplate.getMenu().getMenuItemByIndex(2).clickItem();
        await selectWithTemplate.toggleMenu();
        await eyes.checkWindow("Selector with custom templates");
        await selectWithTemplate.toggleMenu();

        await selectJustified.toggleMenu();
        await eyes.checkWindow("Selector filled the parent width");

        await eyes.close();
    }, 100000);
    });
