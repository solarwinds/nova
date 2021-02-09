import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { DrilldownAtom } from "./drilldown.atom";

describe("Visual tests: Dashboards - Drilldown Widget", () => {
    let eyes: any;
    let drilldownWidget: DrilldownAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("test/drilldown");
        drilldownWidget = Atom.find(DrilldownAtom, "drilldown-widget");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Drilldown Widget");
        await eyes.checkWindow("Default");

        await drilldownWidget.drillFirstGroup();
        await eyes.checkWindow("Leaf");

        await eyes.close();
    }, 100000);
});
