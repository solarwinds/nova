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

import { by, element } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

describe("Dashboards - Table Widget", () => {
    let configurator: ConfiguratorAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/table");
        configurator = Atom.findIn(
            ConfiguratorAtom,
            element(by.className(ConfiguratorAtom.CSS_CLASS))
        );
    });

    it("should generate columns if widget has a datasource and is empty", async () => {
        await page.enableEditMode();
        await page.editWidget("An Empty Table Widget!");
        const accordion = await configurator?.getAccordion(
            "Presentation",
            "Sorting"
        );
        await accordion?.toggle();
        const sortBy = accordion?.getSelect(
            "table-filters-configuration__accordion-content__sort-by-input"
        );
        const count = await sortBy?.countOptions();
        // Amount of columns able to be sorted
        expect(count).toEqual(7);

        const sections = await configurator?.getConfigSections();
        // Amount of total columns in the data source
        expect(sections.length).toEqual(9);

        await configurator.wizard.finish();
        await page.disableEditMode();
    });

    it("should generate columns after changing datasource and clicking reset columns", async () => {
        await page.enableEditMode();
        await page.editWidget("Another Table Widget!");

        const sortingAccordion = await configurator?.getAccordion(
            "Presentation",
            "Sorting"
        );
        await sortingAccordion?.toggle();
        const sortBy = sortingAccordion?.getSelect(
            "table-filters-configuration__accordion-content__sort-by-input"
        );
        let count = await sortBy?.countOptions();
        // Amount of columns able to be sorted before columns are reset
        expect(count).toEqual(2);

        const dataSourceAccordion = await configurator?.getAccordion(
            "Data and Calculations",
            "Data Source"
        );
        await dataSourceAccordion?.toggle();
        const dataSourceSelect = dataSourceAccordion?.getSelect(
            "datasource-configuration__accordion-content__datasource-input"
        );
        await (await dataSourceSelect?.getFirstOption())?.click();
        await sortingAccordion?.toggle();
        count = await sortBy?.countOptions();
        // Amount of columns able to be sorted after datasource changed and before columns are reset
        expect(count).toEqual(2);

        const resetButton = configurator.getResetColumnsButton();
        await resetButton.click();
        await element(by.className("nui-dialog")).$(".btn-primary").click();
        count = await sortBy?.countOptions();
        // Amount of columns able to be sorted after datasource changed and after columns are reset
        expect(count).toEqual(7);

        const sections = await configurator?.getConfigSections();
        // Amount of total columns in the data source
        expect(sections.length).toEqual(9);

        await configurator.wizard.finish();
        await page.disableEditMode();
    });
});
