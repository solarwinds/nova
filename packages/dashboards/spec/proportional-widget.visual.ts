import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ProportionalWidgetAtom } from "./proportional-widget.atom";

describe("Visual tests: Dashboards - Proportional Widget", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let proportionalWidget: ProportionalWidgetAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/proportional");
        proportionalWidget = Atom.find(ProportionalWidgetAtom, "proportional-widget");
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Proportional Widget");
        await eyes.checkWindow("Default");

        await proportionalWidget.hover(proportionalWidget.getLegendSeries());
        await eyes.checkWindow("Hover on legend");

        await eyes.close();
    }, 100000);
});
