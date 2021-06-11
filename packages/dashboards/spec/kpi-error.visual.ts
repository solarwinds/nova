import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";
import { TestPage } from "./test.po";
import { ConfiguratorAtom } from "./configurator/configurator.atom";

const name: string = "Kpi Error";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/kpi/error");
        configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await camera.turn.off();
    }, 100000);

    it(`${name} - Configurator error message types`, async () => {
        await camera.turn.on();

        await page.enableEditMode();
        await page.editWidget("Error Widget");

        const dsAccordion = await configurator?.getAccordion("Value 1 - Average Rating", "Data Source");
        await dsAccordion?.toggle();

        await camera.say.cheese(`${name} - Error 0`);

        const dataSourceSelect = dsAccordion?.getSelect("datasource-configuration__accordion-content__datasource-input");
        await dataSourceSelect?.select("TestKpiDataSource2")
        await camera.say.cheese(`${name} - Error 403`);

        await dataSourceSelect?.select("TestKpiDataSourceBigNumber")
        await camera.say.cheese(`${name} - Error 404`);

        await dataSourceSelect?.select("TestKpiDataSourceSmallNumber")
        await camera.say.cheese(`${name} - No Error`);

        await camera.turn.off();
    }, 100000);
});
