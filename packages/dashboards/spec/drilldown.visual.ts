import { browser } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { DrilldownAtom } from "./drilldown.atom";

const name: string = "Drilldown Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let drilldownWidget: DrilldownAtom;
    let camera: Camera;

    beforeEach(async () => {
        await Helpers.prepareBrowser("test/drilldown");
        drilldownWidget = Atom.find(DrilldownAtom, "drilldown-widget");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await drilldownWidget.drillFirstGroup();
        await camera.say.cheese(`${name} - Leaf`);

        await camera.turn.off();
    }, 100000);
});
