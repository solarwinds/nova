// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { browser, protractor } from "protractor";

import { SearchAtom } from "./search.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

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
