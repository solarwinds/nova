import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { $, browser, by, element, ExpectedConditions } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

const name: string = "Area Chart";

fdescribe(`Visual Tests: Charts - ${name}`, () => {
    let legend: LegendAtom;
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/area/test");
        legend = Atom.findIn(LegendAtom, element(by.tagName("area-chart-bi-directional-example")));
        camera = new Camera().loadFilm(browser, name);
    });

    it("Default look", async () => {
        await camera.turn.on();

        // await browser.sleep(100);
        // await browser.wait(ExpectedConditions.visibilityOf($(".sw-axis-y-left")));

        await camera.say.cheese("Default look");

        await legend.getSeriesByIndex(1).hover();
        await camera.say.cheese("Legend series hovered");

        await camera.turn.off();
    }, 100000);
});
