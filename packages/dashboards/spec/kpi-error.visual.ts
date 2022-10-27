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

import { browser, by, element } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

const name: string = "Kpi Error";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/kpi/error");
        configurator = Atom.findIn(
            ConfiguratorAtom,
            element(by.className(ConfiguratorAtom.CSS_CLASS))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Configurator error message types`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await page.enableEditMode();
        await page.editWidget("Error Widget");

        const dsAccordion = await configurator?.getAccordion(
            "Value 1 - Average Rating",
            "Data Source"
        );
        await dsAccordion?.toggle();

        await camera.say.cheese(`${name} - Error 0`);

        const dataSourceSelect = dsAccordion?.getSelect(
            "datasource-configuration__accordion-content__datasource-input"
        );
        await dataSourceSelect?.select("TestKpiDataSource2");
        await camera.say.cheese(`${name} - Error 403`);

        await dataSourceSelect?.select("TestKpiDataSourceBigNumber");
        await camera.say.cheese(`${name} - Error 404`);

        await dataSourceSelect?.select("TestKpiDataSourceSmallNumber");
        await camera.say.cheese(`${name} - No Error`);

        await camera.turn.off();
    }, 100000);
});
