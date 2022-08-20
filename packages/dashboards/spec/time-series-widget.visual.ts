import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { ChartAtom } from "@nova-ui/charts/sdk/atoms/chart/atoms/chart.atom";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, ElementFinder } from "protractor";
import { TestPage } from "./test.po";

const name: string = "Time Series Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/timeseries");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        const barWidget = await page.dashboard.getWidgetByHeaderTitleText(
            "Bar Chart with Time Interval Scale"
        );
        await barWidget?.scrollTo();
        const barChart = Atom.findIn(
            ChartAtom,
            barWidget?.getElement() as ElementFinder
        );
        await barChart?.hover();

        await camera.say.cheese(`${name} - Chart hovered in right hand column`);

        await camera.turn.off();
    }, 100000);
});
