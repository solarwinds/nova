import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";
import { by, element } from "protractor";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

const name: string = "Table Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/table");
        configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await page.enableEditMode();
        await page.editWidget(`Table Widget!`);

        const accordion = await configurator?.getAccordion("Column 1", "Description");
        await accordion?.toggle();
        const widthInput = accordion?.getTextBoxNumberInput("description-configuration__accordion-content__width-input");
        await widthInput?.clearText();
        await widthInput?.acceptText("70");
        await camera.say.cheese(`${name} - Column width update in preview`);

        await configurator.wizard.finish();
        await page.disableEditMode();
        await camera.say.cheese(`${name} - Column width update after configurator submit`);

        await camera.turn.off();
    }, 100000);
});
