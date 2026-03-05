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

import { Atom, Camera, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { DashboardAtom } from "./dashboard.atom";

const name: string = "Table Widget";

test.describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;
    let dashboard: DashboardAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/table", page);

        configurator = Atom.findIn<ConfiguratorAtom>(ConfiguratorAtom);

        dashboard = Atom.findIn<DashboardAtom>(DashboardAtom);

        camera = new Camera().loadFilm(page, name, "Dashboards");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        // Step 3: Enable edit mode
        await page.locator("#edit-mode").click();

        // Step 4: Open configurator for widget titled "Table Widget!"
        const tableWidget = await dashboard.getWidgetByHeaderTitleText("Table Widget!");
        await tableWidget?.hover();
        await tableWidget?.header.clickEdit();

        // Step 5-6: Find accordion (section "Column 1", label "Description") and toggle it open
        const accordion = await configurator.getAccordion(
            "Column 1",
            "Description"
        );
        await accordion?.toggle();

        // Step 7: Fill width input with "70"
        const widthInput = accordion?.getTextBoxNumberInput(
            "description-configuration__accordion-content__width-input"
        );
        await widthInput?.clearText();
        await widthInput?.acceptText("70");

        await camera.say.cheese(`${name} - Column width update in preview`);

        // Step 9: Submit configurator and wait for it to close
        await page.locator(".nui-dashwiz-buttons__finish-button").click();
        await page.locator(`.${ConfiguratorAtom.CSS_CLASS}`).waitFor({ state: "hidden" });

        // Step 10: Disable edit mode
        await page.locator("#edit-mode").click();

        await camera.say.cheese(`${name} - Column width update after configurator submit`);

        await camera.turn.off();
    });
});
