import { browser } from "protractor";

import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { SorterAtom } from "./sorter.atom";

const name: string = "Sorter";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera, sorter: SorterAtom, sorterLegacyStringInput: SorterAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("sorter/visual-test");

        sorter = SorterAtom.find(SorterAtom, "nui-demo-sorter");
        sorterLegacyStringInput = SorterAtom.find(
            SorterAtom,
            "nui-demo-sorter-legacy-string-input"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await sorter.getSorterButton().click();
        await camera.say.cheese(`Sorting direction changed`);

        await Helpers.switchDarkTheme("on");
        await sorter.click();
        await camera.say.cheese(`Sorter opened with dark theme`);

        await Helpers.switchDarkTheme("off");
        await sorter.getItemByIndex(0).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(2));
        await camera.say.cheese(`Sorter: first item selected`);

        await sorter.getItemByIndex(2).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(0));
        await camera.say.cheese("Sorter: last item selected");

        await sorterLegacyStringInput.getSorterButton().click();
        await camera.say.cheese(
            "Legacy string input sorting direction changed"
        );

        await sorterLegacyStringInput.click();
        await camera.say.cheese("Legacy string input sorter opened");

        await sorterLegacyStringInput.getItemByIndex(0).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(
            sorterLegacyStringInput.getItemByIndex(2)
        );
        await camera.say.cheese(
            "Legacy string input sorter: first item selected"
        );

        await sorterLegacyStringInput.getItemByIndex(2).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(
            sorterLegacyStringInput.getItemByIndex(0)
        );
        await camera.say.cheese(
            "Legacy string input sorter: last item selected"
        );

        await camera.turn.off();
    }, 200000);
});
