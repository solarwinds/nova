import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";
import { by, element } from "protractor";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

describe("Visual tests: Dashboards - Table Widget", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/table");

        configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Table Widget");
        await eyes.checkWindow("Default");

        await page.enableEditMode();
        await page.editWidget("Table Widget!");

        const accordion = await configurator?.getAccordion("Column 1", "Description");
        await accordion?.toggle();
        const widthInput = accordion?.getTextBoxNumberInput("description-configuration__accordion-content__width-input");
        await widthInput?.clearText();
        await widthInput?.acceptText("70");
        await eyes.checkWindow("Column width update in preview");

        await configurator.wizard.finish();
        await page.disableEditMode();
        await eyes.checkWindow("Column width update after configurator submit");

        await eyes.close();
    }, 100000);
});
