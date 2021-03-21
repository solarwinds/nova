import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { SelectorAtom } from "../selector/selector.atom";

import { TableAtom } from "./table.atom";

describe("Visual tests: Table", () => {
    let camera: Camera;
    let tableBasic: TableAtom;
    let sortableTable: TableAtom;
    let actionsMenu: ElementFinder;
    let customActionTable: TableAtom;
    let selectedRowsTable: TableAtom;
    let selector: SelectorAtom;
    let resizeTable: TableAtom;
    let expanders: {[key: string]: ElementFinder};

    beforeEach(async () => {
        await Helpers.prepareBrowser("table/table-visual-test");
        camera = new Camera().loadFilm(browser, "Table");

        tableBasic = Atom.find(TableAtom, "table-basic-usage");
        sortableTable = Atom.find(TableAtom, "table-sorting");
        customActionTable = Atom.find(TableAtom, "table-custom-action");
        selectedRowsTable = Atom.find(TableAtom, "table-selected-row");
        resizeTable = Atom.find(TableAtom, "table-resizing");
        actionsMenu = customActionTable.getElement().all(by.className("nui-menu")).get(0);

        expanders = {
            basicSummary: element(by.id("nui-visual-table-basic-summary")),
            pinnedHeader: element(by.id("nui-visual-table-pinned-summary")),
            columnAlignment: element(by.id("nui-visual-table-alignment-summary")),
            rowDensityTiny: element(by.id("nui-visual-table-row-denisty-tiny-summary")),
            rowDensityCompact: element(by.id("nui-visual-table-row-denisty-compact-summary")),
            sorting: element(by.id("nui-visual-table-sorting-summary")),
            customActions: element(by.id("nui-visual-table-custom-action-summary")),
            columnResize: element(by.id("nui-visual-table-column-size-summary")),
            rowSelection: element(by.id("nui-visual-table-row-selection-summary")),
        };

        const firstHeaderCell = selectedRowsTable.getCell(0, 0);
        selector = selectedRowsTable.getSelector(firstHeaderCell);
    });

    it("Default look", async () => {
        await camera.turn.on();
        await camera.say.cheese("Default");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        for (const key of Object.keys(expanders)) { await expanders[key].click(); }

        await expanders.sorting.click();
        await sortableTable.getCell(0, 4).click();
        await browser.actions().mouseMove({x: 0, y: 300}).perform();
        await camera.say.cheese("Sorting table");
        await expanders.sorting.click();

        await expanders.rowSelection.click();
        await selector.getCheckbox().toggle();
        await browser.actions().mouseMove({x: 0, y: 300}).perform();
        await camera.say.cheese("Selected rows in table");
        await expanders.rowSelection.click();

        await expanders.columnResize.click();
        await resizeTable.hover(resizeTable.getResizers().get(1));
        await camera.say.cheese("Hover on resizable");
        await expanders.columnResize.click();

        await expanders.customActions.click();
        await actionsMenu.click();
        await customActionTable.hover(customActionTable.getCell(2, 4));
        await camera.say.cheese("Edit columns");
        await expanders.customActions.click();

        await camera.turn.off();
    }, 200000);
});
