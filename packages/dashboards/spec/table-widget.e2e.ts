import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";
import { by, element } from "protractor";

import { DialogAtom } from "../../bits/spec";

import { ConfiguratorAtom } from "./configurator/configurator.atom";
import { TestPage } from "./test.po";

describe("Visual tests: Dashboards - Table Widget", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let configurator: ConfiguratorAtom;
    const page = new TestPage();
    const dialogPrompt: DialogAtom = new DialogAtom(element(by.className("nui-dialog")));

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/table");
        configurator = Atom.findIn(ConfiguratorAtom, element(by.className(ConfiguratorAtom.CSS_CLASS)));
    });


    it("should generate columns if widget has a datasource and is empty", async () => {
        await page.enableEditMode();
        await page.editWidget("An Empty Table Widget!");
        const accordion = await configurator?.getAccordion("Presentation", "Sorting");
        await accordion?.toggle();
        const sortBy = accordion?.getSelect("table-filters-configuration__accordion-content__sort-by-input");
        const count = await sortBy?.countOptions();
        // Amount of columns able to be sorted
        expect(count).toEqual(7);

        const sections = await element.all(by.css("nui-widget-configurator-section"));
        // Amount of total columns in the data source
        expect(sections.length).toEqual(9);

        await configurator.wizard.finish();
        await page.disableEditMode();
    });

    it("should generate columns after changing datasource and clicking reset columns", async () => {
        await page.enableEditMode();
        await page.editWidget("Another Table Widget!");

        const sortingAccordion = await configurator?.getAccordion("Presentation", "Sorting");
        await sortingAccordion?.toggle();
        const sortBy = sortingAccordion?.getSelect("table-filters-configuration__accordion-content__sort-by-input");
        let count = await sortBy?.countOptions();
        // Amount of columns able to be sorted before columns are reset
        expect(count).toEqual(2);

        const dataSourceAccordion = await configurator?.getAccordion("Data and Calculations", "Data Source");
        await dataSourceAccordion?.toggle();
        const dataSourceSelect = dataSourceAccordion?.getSelect("datasource-configuration__accordion-content__datasource-input");
        await (await dataSourceSelect?.getFirstOption())?.click();
        await sortingAccordion?.toggle();
        count = await sortBy?.countOptions();
        // Amount of columns able to be sorted after datasource changed and before columns are reset
        expect(count).toEqual(2);

        const resetButton = await configurator.getResetColumnsButton();
        await resetButton.click();
        const actionButton = await dialogPrompt.getActionButton();
        await actionButton.click();
        count = await sortBy?.countOptions();
        // Amount of columns able to be sorted after datasource changed and after columns are reset
        expect(count).toEqual(7);

        const sections = await element.all(by.css("nui-widget-configurator-section"));
        // Amount of total columns in the data source
        expect(sections.length).toEqual(9);

        await configurator.wizard.finish();
        await page.disableEditMode();
    });
});
