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

import isNil from "lodash/isNil";
import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../atom";
import { CheckboxAtom } from "./checkbox.atom";
import { IconAtom } from "./icon.atom";
import { SelectorAtom } from "./selector.atom";

export class TableAtom extends Atom {
    public static CSS_CLASS = "nui-table__table";

    public getColumn(name: string): ElementFinder {
        return this.getElement().element(by.cssContainingText("th", name));
    }

    /**
     *
     * @param {number} rowIndex = 0 stands for header row
     * @param {number} cellIndex
     * @returns {ElementFinder}
     */
    public getCell(rowIndex: number, cellIndex: number): ElementFinder {
        const tableRow = this.getRow(rowIndex);
        if (rowIndex === 0) {
            return tableRow.all(by.tagName("th")).get(cellIndex);
        }
        return tableRow.all(by.tagName("td")).get(cellIndex);
    }

    public async getRowContent(rowIndex: number): Promise<Array<any>> {
        const tableRow = this.getRow(rowIndex);
        const tableCellTag = rowIndex === 0 ? "th" : "td";
        return tableRow
            .all(by.tagName(tableCellTag))
            .map(async (elem): Promise<string> => {
                if (!elem) {
                    throw new Error("elem is not defined");
                }
                return elem.getText();
            });
    }

    public getRow = (rowIndex: number): ElementFinder =>
        this.getElement().all(by.tagName("tr")).get(rowIndex);

    public async getRowsCount(): Promise<number> {
        return this.getElement()
            .all(by.tagName("tr"))
            .count()
            .then((value) => value - 1); // -1 because we don't need to count header row
    }

    /**
     * Check whether a row is selected
     */
    public isRowSelected = async (rowIndex: number): Promise<boolean> =>
        Atom.hasClass(this.getRow(rowIndex), "nui-table__table-row--selected");

    /**
     * Check whether any part of a row can be clicked to make a selection (not just the checkbox)
     */
    public isRowClickable = async (rowIndex: number): Promise<boolean> =>
        Atom.hasClass(this.getRow(rowIndex), "nui-table__table-row--clickable");

    /**
     *
     * @param {number} rowIndex = 0 stands for header row
     * @param {number} cellIndex
     * @returns {Promise<string>}
     */
    public getCellText = async (
        rowIndex: number,
        cellIndex: number
    ): Promise<string> => this.getCell(rowIndex, cellIndex).getText();

    /**
     * Gets all the resizers of table
     * @returns {ElementArrayFinder}
     */
    public getResizers = (): ElementArrayFinder =>
        this.getElement().all(by.css(".nui-table__resizer"));

    /**
     * Gets all header cells of the table
     * @returns {ElementArrayFinder}
     */
    public getHeaderCells = (): ElementArrayFinder =>
        this.getRow(0).all(by.tagName("th"));

    public getSortingIcon = (headerCell: ElementFinder): IconAtom =>
        Atom.findIn(IconAtom, headerCell);

    public getHeaderCellsWithIcon = (): ElementArrayFinder =>
        this.getRow(0).all(by.css(".nui-table__icon-cell"));

    public async checkSortingIcons(
        expectedCellWithIconIndex: number
    ): Promise<void> {
        const missedExpectations: string[] = [];
        const tableHeaderRow = this.getRow(0);
        await tableHeaderRow
            .all(by.tagName("th"))
            .each(
                async (
                    headerCell: ElementFinder | undefined,
                    headerCellIndex
                ) => {
                    if (!headerCell) {
                        throw new Error("headerCell is not defined");
                    }
                    const isIconDisplayed = await this.isSortingIconDisplayed(
                        headerCell
                    );
                    if (
                        headerCellIndex === expectedCellWithIconIndex &&
                        !isIconDisplayed
                    ) {
                        missedExpectations.push(
                            `Expected cell with index = ${headerCellIndex} to contain sorting icon`
                        );
                        fail(missedExpectations.join("\n"));
                    } else if (
                        headerCellIndex !== expectedCellWithIconIndex &&
                        isIconDisplayed
                    ) {
                        missedExpectations.push(
                            `Expected cell with index = ${headerCellIndex} to not contain sorting icon`
                        );
                        fail(missedExpectations.join("\n"));
                    }
                }
            );
    }

    public getCheckbox = (element: ElementFinder): CheckboxAtom =>
        Atom.findIn(CheckboxAtom, element);

    public getSelector = (element: ElementFinder): SelectorAtom =>
        Atom.findIn(SelectorAtom, element);

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
        const rowCount = await this.getElement().all(by.tagName("tr")).count();
        await this.getElement()
            .all(by.tagName("tr"))
            .each(
                async (
                    row: ElementFinder | undefined,
                    rowIndex: number | undefined
                ) => {
                    if (!row || isNil(rowIndex)) {
                        throw new Error("row is not defined");
                    }
                    const checkBoxPresent = await Atom.findIn(
                        CheckboxAtom,
                        this.getCell(rowIndex, 0)
                    ).isPresent();
                    if (checkBoxPresent) {
                        rowsWithCheckboxes++;
                    }
                }
            );
        return rowsWithCheckboxes === (enabled ? rowCount : 0);
    }

    /**
     * Use this method to check whether selection by clicking on a row is enabled or disabled for all body rows.
     * (When row clicking is enabled, the user doesn't have to specifically click the checkbox in order to select the row.)
     *
     * @param enabled Pass 'true' if you want to check whether clicking to select is enabled for all body rows.
     * Pass 'false' to check whether clicking to select is disabled for all body rows.
     *
     * @returns The aggregate clickability status for all body rows
     */
    public async checkRowClickability(enabled: boolean): Promise<boolean> {
        let clickableRows = 0;
        const rowCount = await this.getRowsCount();
        await this.getElement()
            .all(by.tagName("tr"))
            .each(
                async (
                    row: ElementFinder | undefined,
                    index: number | undefined
                ) => {
                    if (!row || isNil(index)) {
                        throw new Error("row is not defined");
                    }
                    // index >= 1 to skip header row
                    if (index >= 1) {
                        const clickable = await this.isRowClickable(index);
                        if (clickable) {
                            clickableRows++;
                        }
                    }
                }
            );
        return clickableRows === (enabled ? rowCount : 0);
    }

    /**
     * Checks if all checkboxes in all rows selected
     */
    public async isAllRowsSelected(): Promise<boolean> {
        let failedTestsCount = 0;
        await this.getElement()
            .all(by.tagName("tr"))
            .each(
                async (
                    row: ElementFinder | undefined,
                    index: number | undefined
                ) => {
                    if (!row || isNil(index)) {
                        throw new Error("row is not defined");
                    }
                    // index >= 1 to skip header row
                    if (index >= 1) {
                        const checkBox = this.getCheckbox(
                            this.getCell(index, 0)
                        );
                        const isChecked = await checkBox.isChecked();
                        if (isChecked !== true) {
                            failedTestsCount++;
                        }
                    }
                }
            );
        return failedTestsCount === 0;
    }

    private isSortingIconDisplayed = async (
        headerCell: ElementFinder
    ): Promise<boolean> => (await Atom.findCount(IconAtom, headerCell)) > 0;
}
