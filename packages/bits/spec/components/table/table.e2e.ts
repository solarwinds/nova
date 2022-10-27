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

import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxGroupAtom } from "../checkbox-group/checkbox-group.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { PaginatorAtom } from "../paginator/paginator.atom";
import { SearchAtom } from "../search/search.atom";
import { SelectorAtom } from "../selector/selector.atom";
import { SelectionType } from "../selector/selector.e2e";
import { TextboxAtom } from "../textbox/textbox.atom";
import { TableAtom } from "./table.atom";

describe("USERCONTROL table >", () => {
    const table: TableAtom = Atom.find(TableAtom, "nui-demo-basic-table");
    const paginatedTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-pagination-table"
    );
    let paginator: PaginatorAtom = Atom.find(
        PaginatorAtom,
        "nui-demo-pagination-table-paginator"
    );
    const widthSetTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-table-cell-width-set"
    );
    const heightSetTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-table-row-height-set"
    );
    const resizableTableTextboxAtom: TextboxAtom = Atom.find(
        TextboxAtom,
        "position-input"
    );
    const searchableTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-searchable-table"
    );
    const searchableTableInput: SearchAtom = Atom.find(
        SearchAtom,
        "nui-demo-searchable-table-search"
    );
    const tableColumnsAddRemove: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-table-columns-add-remove"
    );
    const sortableTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-sortable-table"
    );
    const resizableTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-resizable-table"
    );
    const rowSelectionTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-table-select"
    );
    let selector: SelectorAtom;
    const reorderableTable: TableAtom = Atom.find(
        TableAtom,
        "nui-demo-table-cell-reorder"
    );
    const sortByNameButton: ButtonAtom = Atom.find(
        ButtonAtom,
        "nui-demo-sortable-table-btn"
    );
    const searchByLocationCheckbox: CheckboxAtom = Atom.find(
        CheckboxAtom,
        "nui-demo-searchable-table-checkbox"
    );

    describe("Basic table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/basic");
        });

        it("should have column with right alignment", async () => {
            const column = table.getColumn("Outages");
            expect(await column.getCssValue("text-align")).toEqual("right");
        });

        it("should have nui-row element with height equal to 40px by default, if density attribute is not specified", async () => {
            expect((await table.getRow(1).getSize()).height).toEqual(40);
        });
    });

    describe("Column width set table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/width-set");
        });

        it("table row should have height of 40px", async () => {
            const rowHeight = (await widthSetTable.getRow(1).getSize()).height;
            expect(rowHeight).toBe(40);
        });

        it("icon cell should have width of 40px", async () => {
            const elementWidth = (await widthSetTable.getCell(0, 3).getSize())
                .width;
            expect(elementWidth).toBe(40);
        });

        it("cell should resize on input change", async () => {
            const width = "100";
            await resizableTableTextboxAtom.clearText();
            await resizableTableTextboxAtom.acceptText(width);
            const cellWidth = (await widthSetTable.getCell(0, 0).getSize())
                .width;
            expect(cellWidth).toBe(100);
        });

        it("cell should have min-width of 46px", async () => {
            const width = "10";
            await resizableTableTextboxAtom.clearText();
            await resizableTableTextboxAtom.acceptText(width);
            const cellWidth = (await widthSetTable.getCell(0, 0).getSize())
                .width;
            expect(cellWidth).toBe(46);
        });

        it("cell with ellipsis and tooltipText should have correct tooltip", async () => {
            const tooltipText =
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            const tableElement = widthSetTable.getCell(1, 2);
            expect(await tableElement.getAttribute("title")).toBe(tooltipText);
        });
    });

    describe("Paginated table > ", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/pagination");
        });

        it("should return correct number of rows according to pagination", async () => {
            expect(await paginatedTable.getRowsCount()).toBe(10);
            await paginator.setItemsPerPage(25);
            expect(await paginatedTable.getRowsCount()).toBe(20);
        });
    });

    describe("Searchable table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/search");
        });

        it("should return rows depending on result of the search", async () => {
            expect(await searchableTable.getRowsCount()).toBe(5);
            await searchableTableInput.acceptInput("focus");
            await searchableTableInput.getSearchButton().click();
            expect(await searchableTable.getRowsCount()).toBe(2);
            await searchableTableInput.getCancelButton().click();
            expect(await searchableTable.getRowsCount()).toBe(5);
        });

        it("should search by limited fields", async () => {
            await searchByLocationCheckbox.toggle();
            expect(await searchableTable.getRowsCount()).toBe(5);
            await searchableTableInput.acceptInput("active");
            await searchableTableInput.getSearchButton().click();
            expect(await searchableTable.getRowsCount()).toBe(0);
            await searchableTableInput.getCancelButton().click();

            await searchableTableInput.acceptInput("brno");
            await searchableTableInput.getSearchButton().click();
            expect(await searchableTable.getRowsCount()).toBe(3);
        });
    });

    describe("Height set table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/height");
        });

        it("should have nui-row element with density=tiny height equal to 24px", async () => {
            expect((await heightSetTable.getRow(1).getSize()).height).toEqual(
                24
            );
        });
    });

    describe("Adding and removing table columns >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/custom-actions");
        });

        const editColumnsButton: ButtonAtom = Atom.find(
            ButtonAtom,
            "nui-demo-table-columns-add-remove-edit-btn"
        );
        const submitColumnsButton: ButtonAtom = Atom.find(
            ButtonAtom,
            "nui-demo-table-columns-add-remove-submit-btn"
        );
        const newColumnButton: ButtonAtom = Atom.find(
            ButtonAtom,
            "nui-demo-table-add-remove-new-column-btn"
        );
        const newColumnInput: TextboxAtom = Atom.find(
            TextboxAtom,
            "nui-demo-table-add-remove-new-column-textbox"
        );
        const columnsCheckboxGroup: CheckboxGroupAtom = Atom.find(
            CheckboxGroupAtom,
            "nui-demo-table-add-remove-checkboxes"
        );

        const tableColumnsAddRemoveTestCases = [
            {
                checkboxName: "Reporter",
                testName: "should add 'Reporter' column",
                expectedResult: [
                    "Issue",
                    "Project",
                    "Description",
                    "Status",
                    "Epic",
                    "Actions",
                    "Reporter",
                ],
            },
            {
                checkboxName: "Issue",
                testName: "should remove 'Issue' column",
                expectedResult: [
                    "Project",
                    "Description",
                    "Status",
                    "Epic",
                    "Actions",
                ],
            },
        ];

        tableColumnsAddRemoveTestCases.forEach((testCase: any) => {
            it(testCase.testName, async () => {
                await editColumnsButton.click();
                const checkbox = await columnsCheckboxGroup.getCheckbox(
                    testCase.checkboxName
                );
                await checkbox?.toggle();
                await submitColumnsButton.click();
                expect(await tableColumnsAddRemove.getRowContent(0)).toEqual(
                    testCase.expectedResult
                );
            });
        });

        it("should add new empty column", async () => {
            await editColumnsButton.click();
            await newColumnInput.acceptText("New Column");
            await newColumnButton.click();
            await submitColumnsButton.click();
            expect(await tableColumnsAddRemove.getRowContent(0)).toEqual([
                "Issue",
                "Project",
                "Description",
                "Status",
                "Epic",
                "Actions",
                "New Column",
            ]);
        });
    });

    describe("Sortable table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/sorting");
        });

        it("should sort data properly", async () => {
            expect(await sortableTable.getCellText(1, 4)).toBe("Kyiv");
            const headerCell = sortableTable.getCell(0, 4);
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 4)).toBe("Austin");
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 4)).toBe("Prague");
        });

        it("should do nothing when sorting column with icons", async () => {
            const firstRowContent = await sortableTable.getCellText(1, 2);
            const headerCell = sortableTable.getCell(0, 2);
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 2)).toEqual(
                firstRowContent
            );
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 2)).toEqual(
                firstRowContent
            );
        });

        it("should display sorting icon 'triangle-up' when clicking on table header cell", async () => {
            const headerCell = sortableTable.getCell(0, 2);
            const sortingIcon = sortableTable.getSortingIcon(headerCell);
            await headerCell.click();
            expect(await sortingIcon.getName()).toBe("triangle-up");
        });

        it("should display sorting icon 'triangle-down' when double-clicking on table header cell", async () => {
            const headerCell = sortableTable.getCell(0, 2);
            const sortingIcon = sortableTable.getSortingIcon(headerCell);
            await headerCell.click();
            await headerCell.click();
            expect(await sortingIcon.getName()).toBe("triangle-down");
        });

        it("should display sorting icon only on active header cell", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            const secondCell = sortableTable.getCell(0, 1);
            await firstCell.click();
            await secondCell.click();
            await sortableTable.checkSortingIcons(1);
        });

        it("should not sort by column when it is disabled", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            const sortingCell = sortableTable.getCell(0, 7);
            await firstCell.click();
            await sortingCell.click();
            await sortableTable.checkSortingIcons(0);
        });

        it("cell should apply correct class on click", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            await firstCell.click();
            await browser
                .actions()
                .mouseMove(await firstCell.getWebElement(), { x: 50, y: 50 })
                .perform();
            expect(
                await Atom.hasClass(
                    firstCell,
                    "nui-table__table-header-cell--sortable--dark"
                )
            ).toBeTruthy();
        });

        it("'Name' cell should be sorted in descending order programmatically", async () => {
            await sortByNameButton.click();
            const firstCell = sortableTable.getCell(0, 1);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-down");
            expect(
                await Atom.hasClass(
                    firstCell,
                    "nui-table__table-header-cell--sortable--dark"
                )
            ).toBeTruthy();
        });

        it("'Name' cell should be sorted in ascending order programmatically", async () => {
            await sortByNameButton.click();
            await sortByNameButton.click();
            const firstCell = sortableTable.getCell(0, 1);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-up");
            expect(
                await Atom.hasClass(
                    firstCell,
                    "nui-table__table-header-cell--sortable--dark"
                )
            ).toBeTruthy();
        });

        it("default sorting state should be applied", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-up");
            expect(
                await Atom.hasClass(
                    firstCell,
                    "nui-table__table-header-cell--sortable--dark"
                )
            ).toBeTruthy();
        });
    });

    describe("Resizable table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/resize");
        });

        it("should equally distribute width of non-specified columns", async () => {
            const featuresColumnSize = await resizableTable
                .getColumn("Features")
                .getSize();
            const locationColumnSize = await resizableTable
                .getColumn("Location")
                .getSize();
            const checksColumnSize = await resizableTable
                .getColumn("Checks")
                .getSize();
            expect(featuresColumnSize.width).toEqual(locationColumnSize.width);
            expect(locationColumnSize.width).toEqual(checksColumnSize.width);
        });

        it("should have resizer on each header cell, except for non-resizable columns", async () => {
            const resizersCount = await resizableTable.getResizers().count();
            const headerCellsCount = await resizableTable
                .getHeaderCells()
                .count();
            const iconsCellsCount = await resizableTable
                .getHeaderCellsWithIcon()
                .count();
            const resizableCellsCount = headerCellsCount - iconsCellsCount;
            expect(resizableCellsCount).toEqual(resizersCount);
        });

        it("cell should apply correct class on hover", async () => {
            const firstCell = resizableTable.getCell(0, 0);
            await browser
                .actions()
                .mouseMove(await firstCell.getWebElement(), { x: 5, y: 5 })
                .perform();
            expect(
                await Atom.hasClass(
                    firstCell,
                    "nui-table__table-header-cell--reorderable--dark"
                )
            ).toBeTruthy();
        });

        it("should preserve widths of columns of type 'icon' equal to 40px", async () => {
            const iconCell = resizableTable
                .getElement()
                .element(by.id("nui-header-cell-icon"));
            expect((await iconCell.getSize()).width).toEqual(40);
        });

        it("shouldn't allow to resize non-resizable types of columns by not-rendering Resizer element", async () => {
            const iconCell = resizableTable
                .getElement()
                .element(by.id("nui-header-cell-icon"));
            const iconCellResizer = iconCell.element(
                by.className(".nui-table__resizer")
            );
            expect(await iconCellResizer.isPresent()).toBe(false);
        });
    });

    describe("Sticky header >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/sticky");
        });

        it("adjust the virtual scroll viewport height to accommodate the header height", async () => {
            const container = element(by.id("nui-demo-table-sticky-header"));
            const containerHeight = (await container.getSize()).height;
            const viewPortHeight = (
                await element(
                    by.tagName("cdk-virtual-scroll-viewport")
                ).getSize()
            ).height;

            // Table with sticky header actually consists of two tables (one for the header and one for the table itself).
            // Here we are getting the first one for access to the header.
            const stickyHeader: TableAtom = Atom.findIn(
                TableAtom,
                container,
                0
            );
            const headerHeight = (
                await stickyHeader
                    .getElement()
                    .element(by.tagName("thead"))
                    .getSize()
            ).height;

            expect(headerHeight + viewPortHeight).toEqual(containerHeight);
        });

        it("should populate the last table row with a new row on scroll", async () => {
            const container = element(by.id("nui-demo-table-sticky-header"));

            // Table with sticky header actually consists of two tables (one for the header and one for the table itself).
            // Here we are getting the second one for access to the table.
            const stickyTable: TableAtom = Atom.findIn(TableAtom, container, 1);
            const rowsCount = await stickyTable.getRowsCount();
            const rowElement = stickyTable.getRow(rowsCount - 1);
            const rowContent = await stickyTable.getRowContent(rowsCount - 1);
            const rowTd = rowContent[0];
            expect(rowTd).toEqual("13");

            await browser.executeScript(
                "arguments[0].scrollIntoView(arguments[1])",
                rowElement
            );

            const rowsCountScrolled = await stickyTable.getRowsCount();
            const rowContentScrolled = await stickyTable.getRowContent(
                rowsCountScrolled - 1
            );
            const rowTdScrolled = rowContentScrolled[0];
            expect(rowTdScrolled).toEqual("26");
        });
    });

    describe("Row selection >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/select");
            paginator = Atom.find(
                PaginatorAtom,
                "nui-demo-table-select-paginator"
            );
            const firstHeaderCell = rowSelectionTable.getCell(0, 0);
            selector = rowSelectionTable.getSelector(firstHeaderCell);
        });

        it("should have two items preselected", async () => {
            expect(await selector.getCheckbox().isIndeterminate()).toBeTruthy();
            expect(await rowSelectionTable.isRowSelected(2)).toBeTruthy();
            expect(await rowSelectionTable.isRowSelected(3)).toBeTruthy();
        });

        it("should select items on one page using selector checkbox", async () => {
            await selector.getCheckbox().toggle();
            expect(await rowSelectionTable.isAllRowsSelected()).toBeTruthy();
            expect(await selector.getCheckbox().isChecked()).toBeTruthy();
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
        });

        it("should unselect all items on page when double-click on selector checkbox", async () => {
            await selector.getCheckbox().toggle();
            await selector.getCheckbox().toggle();
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
        });

        it("should select items on one page using selector dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.All);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeTruthy(
                "All rows are not selected"
            );
            expect(await selector.getCheckbox().isChecked()).toBeTruthy(
                "Selector checkbox is not checked"
            );
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy(
                "Some of the rows are selected on page 2"
            );
            expect(await selector.getCheckbox().isChecked()).toBeFalsy(
                "Selector checkbox is not checked"
            );
        });

        it("should unselect items on one page by clicking on selector checkbox when items on all pages are selected", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            await selector.getCheckbox().toggle();
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeTruthy();
            expect(await selector.getCheckbox().isChecked()).toBeTruthy();
        });

        it("should select items on all pages using selectors dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeTruthy();
            expect(await selector.getCheckbox().isChecked()).toBeTruthy();
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeTruthy();
            expect(await selector.getCheckbox().isChecked()).toBeTruthy();
        });

        it("should unselect items on all pages using selector dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            await selector.selectAppendedToBodyItem(SelectionType.None);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
            await paginator.pageLinkClick(2);
            expect(await rowSelectionTable.isAllRowsSelected()).toBeFalsy();
            expect(await selector.getCheckbox().isChecked()).toBeFalsy();
        });

        it("selector checkbox status should = 'indeterminate' if all items except one are selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await selector.selectAppendedToBodyItem(SelectionType.All);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            expect(await selector.getCheckbox().isIndeterminate()).toBeTruthy();
        });

        it("selector checkbox status should = 'indeterminate' if one item is selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            expect(await selector.getCheckbox().isIndeterminate()).toBeTruthy();
        });

        it("should apply correct class on row when row is selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            expect(await rowSelectionTable.isRowSelected(1)).toBeTruthy();
        });
    });

    describe("Reorderable table >", () => {
        beforeEach(async () => {
            await Helpers.prepareBrowser("table/reorder");
        });

        // Chromedriver still does not support html 5 drag/drop. 18.07.2018
        xit("should drag and drop columns", async () => {
            const firstColumn = reorderableTable.getCell(0, 0);
            const secondColumn = reorderableTable.getCell(0, 1);
            await browser
                .actions()
                .dragAndDrop(
                    await firstColumn.getWebElement(),
                    await secondColumn.getWebElement()
                )
                .perform();
            await browser
                .actions()
                .dragAndDrop(
                    await firstColumn.getWebElement(),
                    await secondColumn.getWebElement()
                )
                .perform();
            expect(await reorderableTable.getCell(0, 1).getText()).toBe("No.");
        });
    });

    describe("Selectability toggle >", () => {
        const selectableToggleTable: TableAtom = Atom.find(
            TableAtom,
            "demo-table-selectable-toggle"
        );
        const selectableToggleBtn: ButtonAtom = Atom.find(
            ButtonAtom,
            "demo-table-selectable-toggle-btn"
        );

        beforeAll(async () => {
            await Helpers.prepareBrowser("table/selectable-toggle");
        });

        it("should toggle selectability off", async () => {
            expect(
                await selectableToggleTable.checkSelectability(true)
            ).toEqual(true);
            expect(
                await selectableToggleTable.checkRowClickability(true)
            ).toEqual(true);
            await selectableToggleBtn.click();
            expect(
                await selectableToggleTable.checkSelectability(false)
            ).toEqual(true);
            expect(
                await selectableToggleTable.checkRowClickability(false)
            ).toEqual(true);
        });

        it("should toggle selectability on", async () => {
            expect(
                await selectableToggleTable.checkSelectability(false)
            ).toEqual(true);
            expect(
                await selectableToggleTable.checkRowClickability(false)
            ).toEqual(true);
            await selectableToggleBtn.click();
            expect(
                await selectableToggleTable.checkSelectability(true)
            ).toEqual(true);
            expect(
                await selectableToggleTable.checkRowClickability(true)
            ).toEqual(true);
        });
    });

    describe("Table with actions >", () => {
        const actionsMenu: ElementFinder = tableColumnsAddRemove
            .getElement()
            .all(by.className("nui-menu"))
            .get(0);

        const toggleActionsMenu = async (): Promise<void> =>
            actionsMenu.click();

        const clickAddRowStartButton = async (): Promise<void> =>
            actionsMenu
                .element(
                    by.cssContainingText(
                        ".nui-menu-item__action",
                        "Add new row to the beginning"
                    )
                )
                .click();

        const clickAddRowEndButton = async (): Promise<void> =>
            actionsMenu
                .element(
                    by.cssContainingText(
                        ".nui-menu-item__action",
                        "Add new row to the end"
                    )
                )
                .click();

        const clickRemoveRowButton = async (): Promise<void> =>
            actionsMenu
                .element(
                    by.cssContainingText(".nui-menu-item__action", "Delete row")
                )
                .click();

        beforeEach(async () => {
            await Helpers.prepareBrowser("table/custom-actions");
        });

        it("should add new row to the beginning", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual(
                "NUI-111"
            );
            await toggleActionsMenu();
            await clickAddRowStartButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(6);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual(
                "NUI-100"
            );
        });

        it("should add new row to the end", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(5, 0)).toEqual(
                "NUI-555"
            );
            await toggleActionsMenu();
            await clickAddRowEndButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(6);
            expect(await tableColumnsAddRemove.getCellText(6, 0)).toEqual(
                "NUI-1100"
            );
        });

        it("should delete first row under header", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual(
                "NUI-111"
            );
            await toggleActionsMenu();
            await clickRemoveRowButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(4);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual(
                "NUI-222"
            );
        });
    });
});
