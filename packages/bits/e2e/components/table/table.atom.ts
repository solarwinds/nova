import { Locator } from "@playwright/test";
import { isNil } from "lodash";

import { Atom } from "../../atom";
import { expect } from "../../setup";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { IconAtom } from "../icon/icon.atom";
import { SelectorAtom } from "../selector/selector.atom";

export class TableAtom extends Atom {
    public static CSS_CLASS = "nui-table__table";

    public getColumn(name: string): Locator {
        return this.getLocator().locator("th").filter({ hasText: name });
    }

    /**
     *
     * @param {number} rowIndex = 0 stands for header row
     * @param {number} cellIndex
     * @returns {Locator}
     */
    public getCell(rowIndex: number, cellIndex: number): Locator {
        const tableRow = this.getRow(rowIndex);
        if (rowIndex === 0) {
            return tableRow.locator("th").nth(cellIndex);
        }
        return tableRow.locator("td").nth(cellIndex);
    }

    public getRowContent(rowIndex: number): Locator {
        const tableRow = this.getRow(rowIndex);
        const tableCellTag = rowIndex === 0 ? "th" : "td";
        return tableRow.locator(tableCellTag);
    }

    public getRow = (rowIndex: number): Locator =>
        this.getLocator().locator("tr").nth(rowIndex);

    /*
     * @deprecated use haveCount
     */
    public async getRowsCount(): Promise<number> {
        return this.getLocator()
            .locator("tr")
            .count()
            .then((value) => value - 1); // -1 because we don't need to count header row
    }

    /**
     * Check whether a row is selected
     */
    public isRowSelected = async (rowIndex: number): Promise<void> => {
        await expect(this.getRow(rowIndex)).toHaveClass(
            "nui-table__table-row--selected"
        );
    };

    /**
     * Check whether any part of a row can be clicked to make a selection (not just the checkbox)
     */
    public isRowClickable = async (rowIndex: number): Promise<void> => {
        await expect(this.getRow(rowIndex)).toHaveClass(
            "nui-table__table-row--selected"
        );
    };
    /**
     * Check whether any part of a row can be clicked to make a selection (not just the checkbox)
     */
    public isNotRowClickable = async (rowIndex: number): Promise<void> => {
        await expect(this.getRow(rowIndex)).not.toHaveClass(
            "nui-table__table-row--selected"
        );
    };

    /**
     *
     * @deprecated
     * @param {number} rowIndex = 0 stands for header row
     * @param {number} cellIndex
     * @returns {Promise<string>}
     */
    public getCellText = async (
        rowIndex: number,
        cellIndex: number
    ): Promise<string | null> =>
        this.getCell(rowIndex, cellIndex).textContent();

    /**
     * Gets all the resizers of table
     * @returns {Locator}
     */
    public getResizers = (): Locator =>
        this.getLocator().locator(".nui-table__resizer");

    /**
     * Gets all header cells of the table
     * @returns {Locator}
     */
    public getHeaderCells = (): Locator => this.getRow(0).locator("th");

    public getSortingIcon(headerCell: Locator): IconAtom {
        return Atom.findIn<IconAtom>(IconAtom, headerCell);
    }

    public getHeaderCellsWithIcon = (): Locator =>
        this.getRow(0).locator(".nui-table__icon-cell");

    public async checkSortingIcons(
        expectedCellWithIconIndex: number
    ): Promise<void> {
        const tableHeaderRow = this.getRow(0);
        const row = await tableHeaderRow.locator("th").all();

        for (const headerCell of row) {
            const headerCellIndex = row.indexOf(headerCell);
            if (!headerCell) {
                throw new Error("headerCell is not defined");
            }
            if (headerCellIndex === expectedCellWithIconIndex) {
                await this.isSortingIconDisplayed(
                    headerCell,
                    `Expected cell with index = ${headerCellIndex} to contain sorting icon`
                );
            }
            if (headerCellIndex !== expectedCellWithIconIndex) {
                await this.isNotSortingIconDisplayed(
                    headerCell,
                    `Expected cell with index = ${headerCellIndex} to not contain sorting icon`
                );
            }
        }
    }

    public getCheckbox = (element: Locator): CheckboxAtom =>
        Atom.findIn<CheckboxAtom>(CheckboxAtom, element);

    public getSelector = (element: Locator): SelectorAtom =>
        Atom.findIn<SelectorAtom>(SelectorAtom, element);

    /**
     * Use this method to check whether selection is enabled or disabled for all rows including the header
     *
     * @param enabled Pass 'true' if you want to check whether selection is enabled for all rows including the header.
     * Pass 'false' to check whether selection is disabled for all rows including the header.
     *
     * @returns The aggregate selectability status for all rows
     */
    public async checkSelectability(enabled: boolean): Promise<boolean> {
        let rowsWithCheckboxes = 0;
        const rowCount = await this.getLocator().locator("tr").count();
        const rows = await this.getLocator().locator("tr").all();
        for (const row of rows) {
            const rowIndex: number | undefined = rows.indexOf(row);
            if (!row || isNil(rowIndex)) {
                throw new Error("row is not defined");
            }
            const checkBoxPresent = await Atom.findIn<CheckboxAtom>(
                CheckboxAtom,
                this.getCell(rowIndex, 0)
            ).getInputElement.isVisible();
            if (checkBoxPresent) {
                rowsWithCheckboxes++;
            }
        }
        return rowsWithCheckboxes === (enabled ? rowCount : 0);
    }

    /**
     * Use this method to check whether selection by clicking on a row is enabled or disabled for all body rows.
     * (When row clicking is enabled, the user doesn't have to specifically click the checkbox in order to select the row.)
     * @param checker
     * the function to check if the row has some expectation
     * Pass 'false' to check whether clicking to select is disabled for all body rows.
     *
     * @returns The aggregate clickability status for all body rows
     */
    public async checkRow(
        checker: (index: number) => Promise<void> = this.isRowClickable
    ): Promise<void> {
        const rows = await this.getLocator().locator("tr").all();
        for (const row of rows) {
            const index: number | undefined = rows.indexOf(row);
            if (!row || isNil(index)) {
                throw new Error("row is not defined");
            }
            // index >= 1 to skip header row
            if (index >= 1) {
                await checker(index);
            }
        }
    }

    public async checkRowClickability(all: boolean): Promise<void> {
        await this.checkRow(all ? this.isRowClickable : this.isNotRowClickable);
    }

    /**
     * Checks if all checkboxes in all rows selected
     */
    public async isAllRowsSelected(): Promise<boolean> {
        let failedTestsCount = 0;
        const rows = await this.getLocator().locator("tr").all();
        for (const row of rows) {
            const index: number | undefined = rows.indexOf(row);
            if (!row || isNil(index)) {
                throw new Error("row is not defined");
            }
            // index >= 1 to skip header row
            if (index >= 1) {
                const checkBox = this.getCheckbox(this.getCell(index, 0));
                const isChecked = await checkBox.isChecked();
                if (!isChecked) {
                    failedTestsCount++;
                }
            }
        }
        return failedTestsCount === 0;
    }

    private isSortingIconDisplayed = async (
        headerCell: Locator,
        msg?: string
    ): Promise<void> => {
        expect(await headerCell.count(), msg).toBeGreaterThan(0);
    };

    private isNotSortingIconDisplayed = async (
        headerCell: Locator,
        msg?: string
    ): Promise<void> => {
        expect(await headerCell.count(), msg).not.toBeGreaterThan(0);
    };
}
