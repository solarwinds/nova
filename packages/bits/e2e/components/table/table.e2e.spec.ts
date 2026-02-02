import { TableAtom } from "./table.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
// import { CheckboxGroupAtom } from "../checkbox-group/checkbox-group.atom";
// import { PaginatorAtom } from "../paginator/paginator.atom";
// import { SearchAtom } from "../search/search.atom";
import { SelectorAtom, SelectionType } from "../selector/selector.atom";
import { TextboxAtom } from "../textbox/textbox.atom";
import { CheckboxGroupAtom } from "../checkbox-group/checkbox-group.atom";
import { PaginatorAtom } from "../paginator/paginator.atom";
import { SearchAtom } from "../search/search.atom";

test.describe("USERCONTROL table >", () => {
    let table: TableAtom;
    let paginatedTable: TableAtom;
    let widthSetTable: TableAtom;
    let heightSetTable: TableAtom;
    let customActionsTable: TableAtom;
    let resizableTableTextboxAtom: TextboxAtom;
    let searchableTable: TableAtom;
    let tableColumnsAddRemove: TableAtom;
    let sortableTable: TableAtom;
    let resizableTable: TableAtom;
    let rowSelectionTable: TableAtom;
    let reorderableTable: TableAtom;
    let selector: SelectorAtom;
    let sortByNameButton: ButtonAtom;
    let searchByLocationCheckbox: CheckboxAtom;
    let paginator: PaginatorAtom;
    let searchableTableInput: SearchAtom;

    async function prepareTablePage(page: any, route: any) {
        await Helpers.prepareBrowser(route, page);
        table = Atom.find<TableAtom>(TableAtom, "nui-demo-basic-table");


        widthSetTable = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-table-cell-width-set"
        );
        heightSetTable = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-table-row-height-set"
        );
        customActionsTable = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-custom-table-actions",
            true
        );
        resizableTableTextboxAtom = Atom.find<TextboxAtom>(
            TextboxAtom,
            "position-input"
        );


        tableColumnsAddRemove = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-table-columns-add-remove"
        );

        resizableTable = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-resizable-table"
        );

        reorderableTable = Atom.find<TableAtom>(
            TableAtom,
            "nui-demo-table-cell-reorder"
        );
    }
    test.describe("Basic table >", () => {
        test.beforeEach(async ({ page }) => {
            await prepareTablePage(page, "table/basic");
            await expect(table.getLocator()).toBeVisible();
        });

        test("should have column with right alignment", async () => {
            const column = table.getColumn("Outages");
            await expect(column).toHaveCSS("text-align", "right");
        });

        test("should have nui-row element with height equal to 40px by default, if density attribute is not specified", async () => {
            await expect(table.getRow(1)).toHaveCSS("height", "40px");
        });
    });

    test.describe("Column width set table >", () => {
        test.beforeEach(async ({ page }) => {
            await prepareTablePage(page, "table/width-set");
            await expect(widthSetTable.getLocator()).toBeVisible();
        });

        test("table row should have height of 40px", async () => {
            await expect(widthSetTable.getRow(1)).toHaveCSS("height", "40px");
        });

        test("icon cell should have width of 40px", async () => {
            await expect(widthSetTable.getCell(0, 3)).toHaveCSS(
                "width",
                "40px"
            );
        });

        test("cell should resize on input change", async () => {
            const width = "100";
            await resizableTableTextboxAtom.clearText();
            await resizableTableTextboxAtom.acceptText(width);
            await expect(widthSetTable.getCell(0, 0)).toHaveCSS(
                "width",
                "100px"
            );
        });

        test("cell should have min-width of 46px", async () => {
            const width = "10";
            await resizableTableTextboxAtom.clearText();
            await resizableTableTextboxAtom.acceptText(width);
            await expect(widthSetTable.getCell(0, 0)).toHaveCSS(
                "width",
                "46px"
            );
        });

        test("cell with ellipsis and tooltipText should have correct tooltip", async () => {
            const tooltipText =
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            const tableElement = widthSetTable.getCell(1, 2);
            await expect(tableElement).toHaveAttribute("title");
            expect(await tableElement.getAttribute("title")).toEqual(
                tooltipText
            );
        });
    });

    test.describe("Paginated table > ", () => {
        test.beforeEach(async ({page}) => {
            await Helpers.prepareBrowser("table/pagination", page);
            paginatedTable = Atom.find<TableAtom>(
                TableAtom,
                "nui-demo-pagination-table"
            );
            paginator = Atom.find<PaginatorAtom>(
                PaginatorAtom,
                "nui-demo-pagination-table-paginator"
            );
            await paginatedTable.toBeVisible();
        });

        test("should return correct number of rows according to pagination", async () => {
            expect(await paginatedTable.getRowsCount()).toBe(10);
            await paginator.setItemsPerPage(25);
            expect(await paginatedTable.getRowsCount()).toBe(20);
        });
    });

    test.describe("Searchable table >", () => {
        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/search", page);
            searchableTable = Atom.find<TableAtom>(
                TableAtom,
                "nui-demo-searchable-table"
            );
            searchableTableInput = Atom.find<SearchAtom>(
                SearchAtom,
                "nui-demo-searchable-table-search",
                true
            );
            searchByLocationCheckbox = Atom.find<CheckboxAtom>(
                CheckboxAtom,
                "nui-demo-searchable-table-checkbox"
            );
            await searchableTable.toBeVisible();
        });

        test("should return rows depending on result of the search", async () => {
            expect(await searchableTable.getRowsCount()).toBe(5);
            await searchableTableInput.acceptInput("focus");
            await searchableTableInput.getSearchButton().click();
            expect(await searchableTable.getRowsCount()).toBe(2);
            await searchableTableInput.getCancelButton().click();
            expect(await searchableTable.getRowsCount()).toBe(5);
        });

        test("should search by limited fields", async () => {
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

    test.describe("Height set table >", () => {
        test.beforeEach(async ({ page }) => {
            await prepareTablePage(page, "table/height");
            await expect(heightSetTable.getLocator()).toBeVisible();
        });

        test("should have nui-row element with density=tiny height equal to 24px", async () => {
            await expect(heightSetTable.getRow(1)).toHaveCSS("height", "24px");
        });
    });

    test.describe("Adding and removing table columns >", () => {
        let editColumnsButton: ButtonAtom;
        let submitColumnsButton: ButtonAtom;
        let newColumnButton: ButtonAtom;
        let newColumnInput: TextboxAtom;
        let columnsCheckboxGroup: CheckboxGroupAtom;
        const tableColumnsAddRemoveTestCases = [
            {
                checkboxName: "Reporter",
                testName: "should add 'Reporter' column",
                expectedResult: [
                    " issue ",
                    " project ",
                    " description ",
                    " status ",
                    " epic ",
                    " actions ",
                    " reporter ",
                ],
            },
            {
                checkboxName: "Issue",
                testName: "should remove 'Issue' column",
                expectedResult: [
                    " project ",
                    " description ",
                    " status ",
                    " epic ",
                    " actions ",
                ],
            },
        ];

        test.beforeEach(async ({ page }) => {
            await prepareTablePage(page, "table/custom-actions");
            await expect(customActionsTable.getLocator()).toBeVisible();
            editColumnsButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-demo-table-columns-add-remove-edit-btn"
            );
            submitColumnsButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-demo-table-columns-add-remove-submit-btn"
            );
            newColumnButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-demo-table-add-remove-new-column-btn"
            );
            newColumnInput = Atom.find<TextboxAtom>(
                TextboxAtom,
                "nui-demo-table-add-remove-new-column-textbox"
            );
            columnsCheckboxGroup = Atom.find<CheckboxGroupAtom>(
                CheckboxGroupAtom,
                "nui-demo-table-add-remove-checkboxes"
            );
        });
        tableColumnsAddRemoveTestCases.forEach((testCase: any) => {
            test(testCase.testName, async () => {
                await editColumnsButton.click();
                const checkbox = columnsCheckboxGroup.getCheckbox(
                    testCase.checkboxName
                );
                await checkbox?.toggle();
                await submitColumnsButton.click();
                const rowContent = await tableColumnsAddRemove.getRowContent(0);
                expect(rowContent).toEqual(testCase.expectedResult);
            });
        });

        test("should add new empty column", async () => {
            await editColumnsButton.click();
            await newColumnInput.acceptText("New Column");
            await newColumnButton.click();
            await submitColumnsButton.click();
            const rowContent = await tableColumnsAddRemove.getRowContent(0);
            expect(rowContent).toEqual([
                " issue ",
                " project ",
                " description ",
                " status ",
                " epic ",
                " actions ",
                " New Column ",
            ]);
        });
    });

    test.describe("Sortable table >", () => {
        test.beforeEach(async ({page}) => {
            await Helpers.prepareBrowser("table/sorting", page);
            sortableTable = Atom.find<TableAtom>(
                TableAtom,
                "nui-demo-sortable-table"
            );
            sortByNameButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-demo-sortable-table-btn"
            );
            await sortableTable.toBeVisible();
        });

        test("should sort data properly", async () => {
            expect(await sortableTable.getCellText(1, 4)).toBe("Kyiv");
            const headerCell = sortableTable.getCell(0, 4);
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 4)).toBe("Austin");
            await headerCell.click();
            expect(await sortableTable.getCellText(1, 4)).toBe("Prague");
        });

        test("should do nothing when sorting column with icons", async () => {
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

        test("should display sorting icon 'triangle-up' when clicking on table header cell", async () => {
            const headerCell = sortableTable.getCell(0, 2);
            const sortingIcon = sortableTable.getSortingIcon(headerCell);
            await headerCell.click();
            expect(await sortingIcon.getName()).toBe("triangle-up");
        });

        test("should display sorting icon 'triangle-down' when double-clicking on table header cell", async () => {
            const headerCell = sortableTable.getCell(0, 2);
            const sortingIcon = sortableTable.getSortingIcon(headerCell);
            await headerCell.click();
            await headerCell.click();
            expect(await sortingIcon.getName()).toBe("triangle-down");
        });

        test("should display sorting icon only on active header cell", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            await firstCell.click();
            await sortableTable.getSortingIcon(firstCell).toBeVisible();
            const secondCell = sortableTable.getCell(0, 1);
            await secondCell.click();
            await sortableTable.getSortingIcon(secondCell).toBeVisible();
            await sortableTable.checkSortingIcons(1);
        });

        test("should not sort by column when it is disabled", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            await sortableTable.getSortingIcon(firstCell).toBeVisible();
            const sortingCell = sortableTable.getCell(0, 7);
            await firstCell.click();
            await sortingCell.click();
            await sortableTable.checkSortingIcons(0);
        });

        test("cell should apply correct class on click", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            await firstCell.click();
            await sortableTable.getSortingIcon(firstCell).toBeVisible();
            await firstCell.hover();
            await expect(firstCell).toHaveClass(
                /nui-table__table-header-cell--sortable--dark/
            );
        });

        test("'Name' cell should be sorted in descending order programmatically", async () => {
            await sortByNameButton.click();
            const firstCell = sortableTable.getCell(0, 1);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-down");
            await expect(firstCell).toHaveClass(
                /nui-table__table-header-cell--sortable--dark/
            );
        });

        test("'Name' cell should be sorted in ascending order programmatically", async () => {
            await sortByNameButton.click();
            await sortByNameButton.click();
            const firstCell = sortableTable.getCell(0, 1);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-up");
            await expect(firstCell).toHaveClass(
                /nui-table__table-header-cell--sortable--dark/
            );
        });

        test("default sorting state should be applied", async () => {
            const firstCell = sortableTable.getCell(0, 0);
            const sortingIcon = sortableTable.getSortingIcon(firstCell);
            expect(await sortingIcon.getName()).toBe("triangle-up");
            await expect(firstCell).toHaveClass(
                /nui-table__table-header-cell--sortable--dark/
            );
        });
    });
    //
    // test.describe("Resizable table >", () => {
    //     test.beforeEach(async () => {
    //         await Helpers.prepareBrowser("table/resize");
    //         await resizableTable.waitElementVisible();
    //     });
    //
    //     test("should equally distribute width of non-specified columns", async () => {
    //         const featuresColumnSize = await resizableTable
    //             .getColumn("Features")
    //             .getSize();
    //         const locationColumnSize = await resizableTable
    //             .getColumn("Location")
    //             .getSize();
    //         const checksColumnSize = await resizableTable
    //             .getColumn("Checks")
    //             .getSize();
    //         expect(featuresColumnSize.width).toEqual(locationColumnSize.width);
    //         expect(locationColumnSize.width).toEqual(checksColumnSize.width);
    //     });
    //
    //     test("should have resizer on each header cell, except for non-resizable columns", async () => {
    //         const resizersCount = await resizableTable.getResizers().count();
    //         const headerCellsCount = await resizableTable
    //             .getHeaderCells()
    //             .count();
    //         const iconsCellsCount = await resizableTable
    //             .getHeaderCellsWithIcon()
    //             .count();
    //         const resizableCellsCount = headerCellsCount - iconsCellsCount;
    //         expect(resizableCellsCount).toEqual(resizersCount);
    //     });
    //
    //     test("cell should apply correct class on hover", async () => {
    //         const firstCell = resizableTable.getCell(0, 0);
    //         await browser
    //             .actions()
    //             .mouseMove(await firstCell.getWebElement(), { x: 5, y: 5 })
    //             .perform();
    //         expect(
    //             await Atom.hasClass(
    //                 firstCell,
    //                 "nui-table__table-header-cell--reorderable--dark"
    //             )
    //         ).toBeTruthy();
    //     });
    //
    //     test("should preserve widths of columns of type 'icon' equal to 40px", async () => {
    //         const iconCell = resizableTable
    //             .getLocator()
    //             .locator("#nui-header-cell-icon");
    //         expect((await iconCell.getSize()).width).toEqual(40);
    //     });
    //
    //     test("shouldn't allow to resize non-resizable types of columns by not-rendering Resizer element", async () => {
    //         const iconCell = resizableTable
    //             .getLocator()
    //             .locator("#nui-header-cell-icon");
    //         const iconCellResizer = iconCell.locator(
    //             "..nui-table__resizer"
    //         );
    //         expect(await iconCellResizer.isPresent()).toBe(false);
    //     });
    // });
    //
    test.describe("Sticky header >", () => {
        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/sticky", page);
        });

        test("adjust the virtual scroll viewport height to accommodate the header height", async () => {
            const container = Helpers.page.locator(
                "#nui-demo-table-sticky-header"
            );
            await expect(container).toBeVisible();
            const containerHeight = await container.evaluate(
                (el) => (el as HTMLElement).clientHeight
            );
            const viewPortHeight = await Helpers.page
                .locator("cdk-virtual-scroll-viewport")
                .evaluate((el) => (el as HTMLElement).clientHeight);

            // Table with sticky header actually consists of two tables (one for the header and one for the table itself).
            // Here we are getting the first one for access to the header.
            const stickyHeader: TableAtom = Atom.findIn<TableAtom>(
                TableAtom,
                container
            );
            const headerHeight = await stickyHeader.getLocator().locator("thead").first().evaluate((el) => (el as HTMLElement).clientHeight);

            expect(headerHeight + viewPortHeight).toEqual(containerHeight);
        });

        test("should populate the last table row with a new row on scroll", async () => {
            const stickyTable: TableAtom = Atom.findIn<TableAtom>(
                TableAtom,
                Helpers.page.locator("#nui-demo-table-sticky-header")
            ).nth(TableAtom, 1);
            await stickyTable.toBeVisible();
            const rowsCount = await stickyTable.getRowsCount();
            expect(rowsCount).toBeGreaterThan(1);
            const rowElement = stickyTable.getRow(rowsCount - 1);
            const rowContent = await stickyTable.getRowContent(rowsCount - 1);
            const rowId = Number(rowContent[0]);
            expect(rowId).toBe(13);

            // // Scroll the last row into view
            await rowElement.scrollIntoViewIfNeeded();

            const rowsCountScrolled = await stickyTable.getRowsCount();
            const rowContentScrolled = await stickyTable.getRowContent(
                rowsCountScrolled - 1
            );
            const rowTdScrolled = Number(rowContentScrolled[0]);
            expect(rowTdScrolled).toBeGreaterThan(rowId);
        });
    });

    test.describe("Row selection >", () => {
        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/select", page);
            paginator = Atom.find<PaginatorAtom>(
                PaginatorAtom,
                "nui-demo-table-select-paginator"
            );
            rowSelectionTable = Atom.find<TableAtom>(
                TableAtom,
                "nui-demo-table-select"
            );
            await rowSelectionTable.toBeVisible();
            const firstHeaderCell = rowSelectionTable.getCell(0, 0);
            selector = rowSelectionTable.getSelector(firstHeaderCell);
        });

        test("should have two items preselected", async () => {
            await selector.getCheckbox.isIndeterminate();
            await rowSelectionTable.isRowSelected(2);
            await rowSelectionTable.isRowSelected(3);
        });

        test("should select items on one page using selector checkbox", async () => {
            await selector.getCheckbox.toggle();
            await rowSelectionTable.isAllRowsSelected();
            await selector.getCheckbox.toBeChecked();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
        });

        test("should unselect all items on page when double-click on selector checkbox", async () => {
            await selector.getCheckbox.toggle();
            await selector.getCheckbox.toggle();
            await selector.getCheckbox.toNotBeChecked();
            await rowSelectionTable.isAllRowsNotSelected();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
        });

        test("should select items on one page using selector dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.All);
            await rowSelectionTable.isAllRowsSelected();
            await selector.getCheckbox.toBeChecked();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
        });

        test("should unselect items on one page by clicking on selector checkbox when items on all pages are selected", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            await selector.getCheckbox.toggle();
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsSelected();
            await selector.getCheckbox.toBeChecked();
        });

        test("should select items on all pages using selectors dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            await rowSelectionTable.isAllRowsSelected();
            await selector.getCheckbox.toBeChecked();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsSelected();
            await selector.getCheckbox.toBeChecked();
        });

        test("should unselect items on all pages using selector dropdown", async () => {
            await selector.selectAppendedToBodyItem(SelectionType.AllPages);
            await selector.selectAppendedToBodyItem(SelectionType.None);
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
            await paginator.pageLinkClick(2);
            await rowSelectionTable.isAllRowsNotSelected();
            await selector.getCheckbox.toNotBeChecked();
        });

        test("selector checkbox status should = 'indeterminate' if all items except one are selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await selector.selectAppendedToBodyItem(SelectionType.All);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            await selector.getCheckbox.isIndeterminate();
        });

        test("selector checkbox status should = 'indeterminate' if one item is selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            await selector.getCheckbox.isIndeterminate();
        });

        test("should apply correct class on row when row is selected", async () => {
            const secondCell = rowSelectionTable.getCell(1, 0);
            await rowSelectionTable.getCheckbox(secondCell).toggle();
            await rowSelectionTable.isRowSelected(1);
        });
    });

    test.describe("Reorderable table >", () => {
        let reorderableTable: TableAtom;

        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/reorder", page);
            reorderableTable = Atom.find<TableAtom>(TableAtom, "nui-demo-table-cell-reorder");
            await expect(reorderableTable.getLocator()).toBeVisible();
        });

        test("should drag and drop columns", async () => {
            const firstColumn = reorderableTable.getCell(0, 0);
            const secondColumn = reorderableTable.getCell(0, 1);
            await firstColumn.dragTo(secondColumn);
            expect(await reorderableTable.getCellText(0, 1)).toBe("No.");
        });
    });

    test.describe("Selectability toggle >", () => {
        let selectableToggleTable: TableAtom;
        let selectableToggleBtn: ButtonAtom;

        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/selectable-toggle", page);
            selectableToggleTable = Atom.find<TableAtom>(TableAtom, "demo-table-selectable-toggle");
            selectableToggleBtn = Atom.find<ButtonAtom>(ButtonAtom, "demo-table-selectable-toggle-btn");
            await expect(selectableToggleTable.getLocator()).toBeVisible();
        });

        test("should toggle selectability off", async () => {
            expect(await selectableToggleTable.checkSelectability(true)).toEqual(true);
            await selectableToggleTable.checkRowClickability(true);

            await selectableToggleBtn.click();

            expect(await selectableToggleTable.checkSelectability(false)).toEqual(true);
            await selectableToggleTable.checkRowClickability(false);
        });

        test("should toggle selectability on", async () => {
            await selectableToggleBtn.click();

            expect(await selectableToggleTable.checkSelectability(false)).toEqual(true);
            await selectableToggleTable.checkRowClickability(false);

            await selectableToggleBtn.click();

            expect(await selectableToggleTable.checkSelectability(true)).toEqual(true);
            await selectableToggleTable.checkRowClickability(true);
        });
    });

    test.describe("Table with actions >", () => {
        let actionsMenu: any;
        let tableColumnsAddRemove: TableAtom;

        const toggleActionsMenu = async () => {
            await actionsMenu.click();
        };

        const clickAddRowStartButton = async () => {
            await actionsMenu.getByText("Add new row to the beginning").click();
        };

        const clickAddRowEndButton = async () => {
            await actionsMenu.getByText("Add new row to the end").click();
        };

        const clickRemoveRowButton = async () => {
            await actionsMenu.getByText("Delete row").click();
        };

        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/custom-actions", page);
            tableColumnsAddRemove = Atom.find<TableAtom>(TableAtom, "nui-demo-table-columns-add-remove");
            actionsMenu = tableColumnsAddRemove.getLocator().locator(".nui-menu").first();
            await expect(tableColumnsAddRemove.getLocator()).toBeVisible();
        });

        test("should add new row to the beginning", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual("NUI-111");
            await toggleActionsMenu();
            await clickAddRowStartButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(6);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual("NUI-100");
        });

        test("should add new row to the end", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(5, 0)).toEqual("NUI-555");
            await toggleActionsMenu();
            await clickAddRowEndButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(6);
            expect(await tableColumnsAddRemove.getCellText(6, 0)).toEqual("NUI-1100");
        });

        test("should delete first row under header", async () => {
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(5);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual("NUI-111");
            await toggleActionsMenu();
            await clickRemoveRowButton();
            expect(await tableColumnsAddRemove.getRowsCount()).toEqual(4);
            expect(await tableColumnsAddRemove.getCellText(1, 0)).toEqual("NUI-222");
        });
    });
});
