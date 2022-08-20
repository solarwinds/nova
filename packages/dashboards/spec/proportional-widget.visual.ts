import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ProportionalWidgetAtom } from "./proportional-widget.atom";

const name: string = "Proportional Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let proportionalWidget: ProportionalWidgetAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/proportional");
        proportionalWidget = Atom.find(
            ProportionalWidgetAtom,
            "proportional-widget"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await proportionalWidget.hover(proportionalWidget.getLegendSeries());
        await camera.say.cheese(`${name} - Hover on legend`);

        await camera.turn.off();
    }, 100000);
});
