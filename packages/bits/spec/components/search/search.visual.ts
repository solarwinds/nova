import { browser, protractor } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { SearchAtom } from "./search.atom";

const name: string = "Search";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let searchWithInput: SearchAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("search/search-visual-test");
        searchWithInput = Atom.find(
            SearchAtom,
            "nui-visual-test-search-with-input-text"
        );
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await searchWithInput.getSearchButton().click();
        await browser.actions().sendKeys(protractor.Key.TAB).perform();
        await searchWithInput.getSearchButton().hover();
        await camera.say.cheese(
            `Search with input text is focused and Search button is hovered`
        );

        await browser.actions().mouseMove({ x: 50, y: 0 }).perform();
        await browser.actions().click().perform();
        await searchWithInput.getCancelButton().hover();
        await camera.say.cheese(
            `Cancel button in Search with input text is hovered`
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
