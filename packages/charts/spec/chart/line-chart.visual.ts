import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

describe("Visual Tests: Charts - Line Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let legend: LegendAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("chart-types/line/visual-test");
        legend = Atom.findIn(LegendAtom, element(by.tagName("line-chart-with-axis-labels-example")));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Line Chart");
        await eyes.checkWindow("Default look");

        await legend.getSeriesByIndex(1).hover();
        await eyes.checkWindow("Legend tile hovered");

        await eyes.close();
    }, 100000);
});
