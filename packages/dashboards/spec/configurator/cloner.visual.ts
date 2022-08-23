import { browser, by, element } from "protractor";

import { Atom, ButtonAtom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ConfiguratorAtom } from "./configurator.atom";

const name: string = "Configurator";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/configurator");

        configurator = Atom.findIn(
            ConfiguratorAtom,
            element(by.className(ConfiguratorAtom.CSS_CLASS))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Cloner`, async () => {
        await camera.turn.on();

        const cloneButton = Atom.findIn(
            ButtonAtom,
            element(by.className("nui-widget-cloner-test-button"))
        );
        await cloneButton.click();
        await camera.say.cheese(`${name} - Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`${name} - Default Dark Theme`);
        await Helpers.switchDarkTheme("off");

        await configurator.wizard.next();

        const accordion = await configurator?.getAccordion(
            "Value 1",
            "Description"
        );
        await accordion?.toggle();
        const backgroundColorSelect = accordion?.getSelect(
            "kpi-description-configuration__accordion-content__color-picker"
        );
        await backgroundColorSelect?.click();
        await camera.say.cheese(`${name} - Select popup is displayed`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(
            `${name} - Select popup is displayed in Dark Theme`
        );

        await camera.turn.off();
    }, 100000);
});
