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

import { Locator } from "playwright-core";
import { TableAtom } from "./table.atom";
import { Atom } from "../../atom";
import { test, Helpers } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { SelectorAtom } from "../selector/selector.atom";


const name: string = "Table";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let sortableTable: TableAtom;
    let actionsMenu: Locator;
    let customActionTable: TableAtom;
    let selectedRowsTable: TableAtom;
    let selector: SelectorAtom;
    let resizeTable: TableAtom;
    let selectPinnedHeaderTable: TableAtom;
    let expanders: { [key: string]: Locator };

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("table/visual-test", page);

        sortableTable = Atom.find<TableAtom>(TableAtom, "table-sorting");
        customActionTable = Atom.find<TableAtom>(
            TableAtom,
            "table-custom-action"
        );
        selectedRowsTable = Atom.find<TableAtom>(
            TableAtom,
            "table-selected-row"
        );
        resizeTable = Atom.find<TableAtom>(TableAtom, "table-resizing");
        selectPinnedHeaderTable = Atom.find<TableAtom>(
            TableAtom,
            "table-select-pinned-header"
        );
        actionsMenu = customActionTable
            .getLocator()
            .locator(".nui-menu")
            .nth(0);

        expanders = {
            basicSummary: Helpers.page.locator(
                "#nui-visual-table-basic-summary"
            ),
            pinnedHeader: Helpers.page.locator(
                "#nui-visual-table-pinned-summary"
            ),
            columnAlignment: Helpers.page.locator(
                "#nui-visual-table-alignment-summary"
            ),
            rowDensityTiny: Helpers.page.locator(
                "#nui-visual-table-row-density-tiny-summary"
            ),
            rowDensityCompact: Helpers.page.locator(
                "#nui-visual-table-row-density-compact-summary"
            ),
            sorting: Helpers.page.locator("#nui-visual-table-sorting-summary"),
            customActions: Helpers.page.locator(
                "#nui-visual-table-custom-action-summary"
            ),
            columnResize: Helpers.page.locator(
                "#nui-visual-table-column-size-summary"
            ),
            rowSelection: Helpers.page.locator(
                "#nui-visual-table-row-selection-summary"
            ),
            selectPinnedHeader: Helpers.page.locator(
                "#nui-visual-table-select-pinned-header-summary"
            ),
            virtualScrollStickyHeader: Helpers.page.locator(
                "#nui-visual-table-virtual-scroll-sticky-header-summary"
            ),
        };

        const firstHeaderCell = selectedRowsTable.getCell(0, 0);
        selector = selectedRowsTable.getSelector(firstHeaderCell);
        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
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
        await Helpers.page.mouse.move(0, 300);
        await camera.say.cheese("Sorting table");
        await expanders.sorting.click();

        await expanders.rowSelection.click();
        await selector.getCheckbox.toggle();
        await Helpers.page.mouse.move(0, 300);
        await camera.say.cheese("Selected rows in table");
        await expanders.rowSelection.click();

        await expanders.columnResize.click();
        await resizeTable.hover(resizeTable.getResizers().nth(1));
        await camera.say.cheese("Hover on resizable");
        await expanders.columnResize.click();

        await expanders.customActions.click();
        await actionsMenu.click();
        await customActionTable.hover(customActionTable.getCell(2, 3));
        await camera.say.cheese("Edit columns");
        await expanders.customActions.click();

        await expanders.selectPinnedHeader.click();
        await selectPinnedHeaderTable.getCell(1, 0).click();
        await Helpers.page.evaluate(()=>{
            const tableContainer = document.getElementById("table-select-pinned-header")?.getElementsByClassName("nui-table__container")[0];
            if(tableContainer){
                tableContainer.scrollTop = 20;
            }
        });

        await camera.say.cheese("Active checkbox under pinned header");
        await expanders.selectPinnedHeader.click();

        await expanders.virtualScrollStickyHeader.click();
        await camera.say.cheese("Virtual Scroll Table with Sticky Header");
        await expanders.virtualScrollStickyHeader.click();

        await camera.turn.off();
    });
});
