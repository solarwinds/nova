import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "./legend.atom";

const name: string = "Legend";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let seriesRenderStatesLegend: LegendAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("advanced-usage/legend/visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        seriesRenderStatesLegend = Atom.findIn(LegendAtom, element(by.className("legend-series-render-states")));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese("Default");

        const unselectedLegendSeries = seriesRenderStatesLegend.getSeriesByIndex(0);
        await seriesRenderStatesLegend.hover(unselectedLegendSeries.getElement());
        await camera.say.cheese(`${name} - Check unselected/hidden series on hover`);

        const selectedLegendSeries = seriesRenderStatesLegend.getSeriesByIndex(3);
        await seriesRenderStatesLegend.hover(selectedLegendSeries.getElement());
        await camera.say.cheese(`${name} - Check selected series on hover`);

        await seriesRenderStatesLegend.hover(selectedLegendSeries.richTile.getElement());
        await camera.say.cheese(`${name} - Check selected series on tile hover`);

        await camera.turn.off();
    }, 100000);
});
