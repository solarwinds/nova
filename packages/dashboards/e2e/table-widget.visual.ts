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

import { browser } from "protractor";
import { by, element } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

const name: string = "Table Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/table");
        configurator = Atom.findIn(
            ConfiguratorAtom,
            element(by.className(ConfiguratorAtom.CSS_CLASS))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await page.enableEditMode();
        await page.editWidget(`Table Widget!`);

        const accordion = await configurator?.getAccordion(
            "Column 1",
            "Description"
        );
        await accordion?.toggle();
        const widthInput = accordion?.getTextBoxNumberInput(
            "description-configuration__accordion-content__width-input"
        );
        await widthInput?.clearText();
        await widthInput?.acceptText("70");
        await camera.say.cheese(`${name} - Column width update in preview`);

        await configurator.wizard.finish();
        await page.disableEditMode();
        await camera.say.cheese(
            `${name} - Column width update after configurator submit`
        );

        await camera.turn.off();
    }, 100000);
});
