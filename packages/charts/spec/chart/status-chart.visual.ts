import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { StatusChartAtom } from "./status-chart.atom";

const name: string = "Status Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let statusChartWithIcons: StatusChartAtom;
    const firstStatusChartSeriesID = "1";

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/status/test");
        statusChartWithIcons = Atom.find(
            StatusChartAtom,
            "nui-status-chart-with-icons"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`${name} - Default`);

        await (
            await statusChartWithIcons.getStatusBarDataPointByIndex(
                firstStatusChartSeriesID,
                5
            )
        ).hover();
        await camera.say.cheese(`${name} - Middle status bar hovered`);

        const originalSize = await browser.manage().window().getSize();
        await browser.manage().window().setSize(340, 800);
        await camera.say.cheese(
            `${name} - Layout is not affected by resize + icons are not be displayed if bar size is too low`
        );

        await browser
            .manage()
            .window()
            .setSize(originalSize.width, originalSize.height);

        await camera.turn.off();
    }, 100000);
});
