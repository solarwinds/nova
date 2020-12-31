import { Atom, ButtonAtom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { ConfiguratorAtom } from "./configurator.atom";

describe("Visual tests: Dashboards - configurator", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let configurator: ConfiguratorAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/configurator");

        configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));
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

        await configurator.wizard.next();

        const accordion = await configurator?.getAccordion("Value 1", "Description");
        await accordion?.toggle();
        const backgroundColorSelect = accordion?.getSelect("kpi-description-configuration__accordion-content__color-picker");
        await backgroundColorSelect?.click();
        await eyes.checkWindow("Select popup is displayed");

        await eyes.close();
    }, 100000);

});
