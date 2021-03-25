import { Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { TestPage } from "./test.po";

const name: string = "Dashboards - Overview";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/overview");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await page.dashboard.getWidgetByIndex(0).hover();
        await camera.say.cheese(`${name} - Default`);

        await page.enableEditMode();
        await camera.say.cheese(`${name} - Edit Mode Default`);

        const widget = page.dashboard.getWidgetByIndex(2);
        await widget.hover();
        await camera.say.cheese(`${name} - Widget Hovered in Edit Mode`);

        await page.disableEditMode();
        await page.resetMousePosition();

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark Theme`);

        await page.disableDarkTheme();

        await camera.turn.off();
    }, 100000);
});
