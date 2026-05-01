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

import {
    Atom,
    Camera,
    Helpers,
    test,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { DashboardAtom } from "./dashboard.atom";

const name: string = "Kpi Error";

test.describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    let dashboard: DashboardAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/kpi/error", page);

        configurator = Atom.findIn<ConfiguratorAtom>(
            ConfiguratorAtom,
            page.locator(`.${ConfiguratorAtom.CSS_CLASS}`)
        );

        dashboard = Atom.findIn<DashboardAtom>(
            DashboardAtom,
            page.locator(`.${DashboardAtom.CSS_CLASS}`)
        );

        camera = new Camera().loadFilm(page, name, "Dashboards");
    });

    test(`${name} - Configurator error message types`, async ({ page }) => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        // Enable edit mode
        await page.locator("#edit-mode").click();

        // Edit the "Error Widget"
        const errorWidget = await dashboard.getWidgetByHeaderTitleText(
            "Error Widget"
        );
        await errorWidget?.header.clickEdit();

        const dsAccordion = await configurator.getAccordion(
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
    });
});
