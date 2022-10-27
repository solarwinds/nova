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

import { NgZone } from "@angular/core";

import { SelectorService } from "../selector/selector.service";
import { TableSpecHelpers } from "./table-spec-helpers/table-spec-helpers";
import {
    AlignmentClasses,
    TableStateHandlerService,
} from "./table-state-handler.service";

describe("services >", () => {
    describe("table-state-handler >", () => {
        const columnReorderTestCases = [
            {
                dragCell: 0,
                dropCell: 1,
                dropCellWidth: 100,
                dropCellOffsetX: 10,
                expectedResult: ["first", "second", "third"],
            },
            {
                dragCell: 0,
                dropCell: 1,
                dropCellWidth: 100,
                dropCellOffsetX: 90,
                expectedResult: ["second", "first", "third"],
            },
            {
                dragCell: 1,
                dropCell: 0,
                dropCellWidth: 200,
                dropCellOffsetX: 190,
                expectedResult: ["first", "second", "third"],
            },
            {
                dragCell: 1,
                dropCell: 0,
                dropCellWidth: 200,
                dropCellOffsetX: 90,
                expectedResult: ["second", "first", "third"],
            },
            {
                dragCell: 0,
                dropCell: 2,
                dropCellWidth: 100,
                dropCellOffsetX: 49,
                expectedResult: ["second", "first", "third"],
            },
            {
                dragCell: 0,
                dropCell: 2,
                dropCellWidth: 100,
                dropCellOffsetX: 51,
                expectedResult: ["second", "third", "first"],
            },
            {
                dragCell: 2,
                dropCell: 0,
                dropCellWidth: 200,
                dropCellOffsetX: 101,
                expectedResult: ["first", "third", "second"],
            },
            {
                dragCell: 2,
                dropCell: 0,
                dropCellWidth: 200,
                dropCellOffsetX: 99,
                expectedResult: ["third", "first", "second"],
            },
        ];

        let serviceInstance: TableStateHandlerService;

        beforeEach(() => {
            serviceInstance = new TableStateHandlerService(
                NgZone as any,
                SelectorService as any
            );
            serviceInstance.tableColumns = ["first", "second", "third"];
        });

        it("Should provide correct class for right alignment", () => {
            const calculatedAlignment = serviceInstance.defineAlignment(42);
            expect(calculatedAlignment).toEqual(AlignmentClasses.RIGHT);
        });

        it("Should store a state of a column alignment", () => {
            serviceInstance.setAlignment("myColumn", AlignmentClasses.CENTER);
            expect(serviceInstance.getAlignment("myColumn")).toEqual(
                AlignmentClasses.CENTER
            );
        });

        describe("columns reorder >", () => {
            beforeEach(() => {
                serviceInstance.reorderable = true;
            });

            columnReorderTestCases.forEach((test) => {
                it(`should reorder columns when dragging from cell #${test.dragCell} to cell#${test.dropCell}
                when drop position is ${test.dropCellOffsetX}px and cell width is ${test.dropCellWidth}px`, () => {
                    serviceInstance.dragCellIndex = test.dragCell;
                    serviceInstance.draggedOverCellIndex = test.dropCell;
                    serviceInstance.dropCellOffsetX = test.dropCellOffsetX;
                    serviceInstance.dropCellWidth = test.dropCellWidth;
                    serviceInstance.getNewCellIndex();
                    serviceInstance.reorderColumnsOnDrop();
                    expect(serviceInstance.tableColumns).toEqual(
                        test.expectedResult
                    );
                });
            });
        });

        describe("columns sorting >", () => {
            beforeEach(() => {
                serviceInstance.sortable = true;
            });

            it("should properly apply sorting direction", () => {
                const tableStateSpy = spyOn(
                    serviceInstance.sortingState,
                    "next"
                ).and.callThrough();
                serviceInstance.sortColumn(0);
                expect(tableStateSpy).toHaveBeenCalledWith(
                    TableSpecHelpers.getColumnSortTestStates()[0]
                );
                serviceInstance.sortColumn(0);
                expect(tableStateSpy).toHaveBeenCalledWith(
                    TableSpecHelpers.getColumnSortTestStates()[1]
                );
                serviceInstance.sortColumn(1);
                expect(tableStateSpy).toHaveBeenCalledWith(
                    TableSpecHelpers.getColumnSortTestStates()[2]
                );
                serviceInstance.sortColumn(1);
                expect(tableStateSpy).toHaveBeenCalledWith(
                    TableSpecHelpers.getColumnSortTestStates()[3]
                );
            });
        });

        describe("columns resizing >", () => {
            beforeEach(() => {
                serviceInstance.resizable = true;
            });

            it("should calculate width of columns only once", () => {
                const calculateWidth = spyOn(
                    serviceInstance,
                    "calculateWidthsOfColumns"
                ).and.callThrough();
                expect(
                    serviceInstance.getColumnWidth("first")
                ).toBeGreaterThanOrEqual(46);
                expect(calculateWidth).toHaveBeenCalled();
                expect(
                    serviceInstance.getColumnWidth("second")
                ).toBeGreaterThanOrEqual(46);
                expect(calculateWidth.calls.count()).toBeLessThan(2);
            });

            it("calculation of columns should be performed once", () => {
                serviceInstance.tableColumns = ["first", "second"];
                const calculateWidthsOfColumnsSpy = spyOn(
                    serviceInstance,
                    "calculateWidthsOfColumns"
                ).and.callThrough();
                serviceInstance.getColumnWidth("first");
                serviceInstance.getColumnWidth("second");
                expect(calculateWidthsOfColumnsSpy).toHaveBeenCalledTimes(1);
            });

            it("user's column width should be taken into consideration", () => {
                // 150px width of the column and 1px for the border
                const expectedWidthConsideringBorder = 149;
                serviceInstance.tableColumns = ["first", "second"];
                serviceInstance.setColumnWidth("first", 50);
                serviceInstance.tableParentWidth = 200;
                serviceInstance.calculateWidthsOfColumns();
                const firstColumnWidth =
                    serviceInstance.getColumnWidth("first");
                const secondColumnWidth =
                    serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(50);
                expect(secondColumnWidth).toEqual(
                    expectedWidthConsideringBorder
                );
            });

            it("width of columns should be distributed equally", () => {
                const expectedWidthConsideringBorder = 99;
                serviceInstance.tableColumns = ["first", "second"];
                serviceInstance.tableParentWidth = 200;
                serviceInstance.calculateWidthsOfColumns();
                const firstColumnWidth =
                    serviceInstance.getColumnWidth("first");
                const secondColumnWidth =
                    serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(
                    expectedWidthConsideringBorder
                );
                expect(secondColumnWidth).toEqual(
                    expectedWidthConsideringBorder
                );
            });

            it("should take in consideration non-resizable columns of type 'icon' when calculating columns widths", () => {
                const expectedWidthConsideringBorder = 159;
                const iconTypeColumnWidth = 40;
                serviceInstance.tableColumns = ["first", "second"];
                serviceInstance.columnType = {
                    columnName: "first",
                    columnType: "icon",
                };
                serviceInstance.tableParentWidth = 200;
                serviceInstance.calculateWidthsOfColumns();
                const firstColumnWidth =
                    serviceInstance.getColumnWidth("first");
                const secondColumnWidth =
                    serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(iconTypeColumnWidth);
                expect(secondColumnWidth).toEqual(
                    expectedWidthConsideringBorder
                );
            });
        });
    });
});
