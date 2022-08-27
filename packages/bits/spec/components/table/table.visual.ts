import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { SelectorAtom } from "../selector/selector.atom";
import { TableAtom } from "./table.atom";

const name: string = "Table";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let sortableTable: TableAtom;
    let actionsMenu: ElementFinder;
    let customActionTable: TableAtom;
    let selectedRowsTable: TableAtom;
    let selector: SelectorAtom;
    let resizeTable: TableAtom;
    let selectPinnedHeaderTable: TableAtom;
    let expanders: { [key: string]: ElementFinder };

    beforeAll(async () => {
        await Helpers.prepareBrowser("table/visual-test");

        sortableTable = Atom.find(TableAtom, "table-sorting");
        customActionTable = Atom.find(TableAtom, "table-custom-action");
        selectedRowsTable = Atom.find(TableAtom, "table-selected-row");
        resizeTable = Atom.find(TableAtom, "table-resizing");
        selectPinnedHeaderTable = Atom.find(
            TableAtom,
            "table-select-pinned-header"
        );
        actionsMenu = customActionTable
            .getElement()
            .all(by.className("nui-menu"))
            .get(0);

        expanders = {
            basicSummary: element(by.id("nui-visual-table-basic-summary")),
            pinnedHeader: element(by.id("nui-visual-table-pinned-summary")),
            columnAlignment: element(
                by.id("nui-visual-table-alignment-summary")
            ),
            rowDensityTiny: element(
                by.id("nui-visual-table-row-density-tiny-summary")
            ),
            rowDensityCompact: element(
                by.id("nui-visual-table-row-density-compact-summary")
            ),
            sorting: element(by.id("nui-visual-table-sorting-summary")),
            customActions: element(
                by.id("nui-visual-table-custom-action-summary")
            ),
            columnResize: element(
                by.id("nui-visual-table-column-size-summary")
            ),
            rowSelection: element(
                by.id("nui-visual-table-row-selection-summary")
            ),
            selectPinnedHeader: element(
                by.id("nui-visual-table-select-pinned-header-summary")
            ),
            virtualScrollStickyHeader: element(
                by.id("nui-visual-table-virtual-scroll-sticky-header-summary")
            ),
        };

        const firstHeaderCell = selectedRowsTable.getCell(0, 0);
        selector = selectedRowsTable.getSelector(firstHeaderCell);

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        for (const key of Object.keys(expanders)) {
            await expanders[key].click();
        }

        await expanders.sorting.click();
        await sortableTable.getCell(0, 4).click();
        await browser.actions().mouseMove({ x: 0, y: 300 }).perform();
        await camera.say.cheese("Sorting table");
        await expanders.sorting.click();

        await expanders.rowSelection.click();
        await selector.getCheckbox().toggle();
        await browser.actions().mouseMove({ x: 0, y: 300 }).perform();
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

        await expanders.selectPinnedHeader.click();
        await selectPinnedHeaderTable.getCell(1, 0).click();
        await browser.executeScript(
            "document.getElementById('table-select-pinned-header').getElementsByClassName('nui-table__container')[0].scrollTop = '20'"
        );
        await camera.say.cheese("Active checkbox under pinned header");
        await expanders.selectPinnedHeader.click();

        await expanders.virtualScrollStickyHeader.click();
        await camera.say.cheese("Virtual Scroll Table with Sticky Header");
        await expanders.virtualScrollStickyHeader.click();

        await camera.turn.off();
    }, 300000);
});
