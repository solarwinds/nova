import { Atom, ButtonAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { ConfiguratorAtom } from "./configurator.atom";

describe("Visual tests: Dashboards - configurator", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/configurator");
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Cloner", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Cloner");

        const cloneButton = Atom.findIn(ButtonAtom, element(by.className("nui-widget-cloner-test-button")));

        await cloneButton.click();
        await eyes.checkWindow("Default");

        const customizeButton = Atom.findIn(ButtonAtom, element(by.className("nui-dashwiz-buttons__next-button")));
        await customizeButton.click();

        const configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));
        const section = configurator.getSectionByIndex(1);

        const accordion = section.getAccordionByIndex(0);
        await accordion.toggle();

        const backgroundColorSelect = accordion.getSelectByIndex(0);

        await backgroundColorSelect.click();
        await eyes.checkWindow("Select popup is displayed");

        await eyes.close();
    }, 100000);

});
