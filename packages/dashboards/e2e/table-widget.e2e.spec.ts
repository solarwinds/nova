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
    Helpers,
    test,
    expect,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { DashboardAtom } from "./dashboard.atom";

const name = "Table Widget";

test.describe(`Dashboards - ${name}`, () => {
    let configurator: ConfiguratorAtom;
    let dashboard: DashboardAtom;

    const enableEditMode = async (page: any): Promise<void> => {
        await page.locator("#edit-mode").click();
    };

    const disableEditMode = async (page: any): Promise<void> => {
        await page.locator("#edit-mode").click();
    };

    const countSelectOptions = async (
        select: any,
        page: any
    ): Promise<number> => {
        await select.click();
        // Options render inside the configurator's overlay container, not body's
        await page.locator(".cdk-overlay-pane").first().waitFor({ state: "visible" });
        const count = await page
            .locator(".cdk-overlay-pane nui-select-v2-option")
            .count();
        await page.keyboard.press("Escape");
        return count;
    };

    const editWidget = async (
        title: string,
        dashboard: DashboardAtom
    ): Promise<void> => {
        const widget = await dashboard.getWidgetByHeaderTitleText(title);
        await widget?.hover();
        await widget?.header.clickEdit();
    };

    const submitConfigurator = async (page: any): Promise<void> => {
        await page
            .locator(".nui-dashwiz-buttons__finish-button")
            .click();
        await page
            .locator(`.${ConfiguratorAtom.CSS_CLASS}`)
            .waitFor({ state: "hidden" });
    };

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/table", page);

        configurator = Atom.findIn<ConfiguratorAtom>(ConfiguratorAtom);
        dashboard = Atom.findIn<DashboardAtom>(DashboardAtom);
    });

    test("should generate columns if widget has a datasource and is empty", async ({
        page,
    }) => {
        await enableEditMode(page);
        await editWidget("An Empty Table Widget!", dashboard);

        // Open the Sorting accordion in the Presentation section
        const accordion = await configurator.getAccordion(
            "Presentation",
            "Sorting"
        );
        await accordion?.toggle();

        // Wait for the accordion content to be visible
        await accordion
            ?.getLocator()
            .locator(
                ".table-filters-configuration__accordion-content__sort-by-input"
            )
            .waitFor({ state: "visible" });

        // Count sort-by options — should equal the number of sortable columns
        const sortBy = accordion?.getSelect(
            "table-filters-configuration__accordion-content__sort-by-input"
        );
        const optionCount = await countSelectOptions(sortBy, page);
        expect(optionCount).toEqual(7);

        // Count total configurator sections — should equal total columns in the data source
        const sections = configurator
            .getLocator()
            .locator("nui-widget-configurator-section");
        const sectionsCount = await sections.count();
        expect(sectionsCount).toEqual(9);

        await submitConfigurator(page);
        await disableEditMode(page);
    });

    test("should generate columns after changing datasource and clicking reset columns", async ({
        page,
    }) => {
        await enableEditMode(page);
        await editWidget("Another Table Widget!", dashboard);

        // Open the Sorting accordion and count options before reset
        const sortingAccordion = await configurator.getAccordion(
            "Presentation",
            "Sorting"
        );
        await sortingAccordion?.toggle();

        const sortBy = sortingAccordion?.getSelect(
            "table-filters-configuration__accordion-content__sort-by-input"
        );
        let count = await countSelectOptions(sortBy, page);
        expect(count).toEqual(2);

        // Change the data source
        const dataSourceAccordion = await configurator.getAccordion(
            "Data and Calculations",
            "Data Source"
        );
        await dataSourceAccordion?.toggle();

        const dataSourceSelect = dataSourceAccordion?.getSelect(
            "datasource-configuration__accordion-content__datasource-input"
        );
        // Click the select to open dropdown, then pick the first option
        await dataSourceSelect?.click();
        await page.locator(".cdk-overlay-pane").first().waitFor({ state: "visible" });
        await page.locator(".cdk-overlay-pane nui-select-v2-option").first().click();

        // Count sort-by options after datasource changed but before reset
        await sortingAccordion?.toggle();
        count = await countSelectOptions(sortBy, page);
        expect(count).toEqual(2);

        // Click reset columns and confirm the dialog
        await page.locator("#table-widget-reset-indicator-btn").click();
        await page
            .locator(".nui-dialog")
            .locator(".btn-primary")
            .click();

        // Count sort-by options after reset
        count = await countSelectOptions(sortBy, page);
        expect(count).toEqual(7);

        // Count total configurator sections after reset
        const sections = configurator
            .getLocator()
            .locator("nui-widget-configurator-section");
        const sectionsCount = await sections.count();
        expect(sectionsCount).toEqual(9);

        await submitConfigurator(page);
        await disableEditMode(page);
    });
});
