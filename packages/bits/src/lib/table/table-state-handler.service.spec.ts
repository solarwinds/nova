import { NgZone } from "@angular/core";

import { SelectorService } from "../selector/selector.service";
import { ICON_CELL_WIDTH_PX } from "./constants";

import { TableSpecHelpers } from "./table-spec-helpers/table-spec-helpers";
import { AlignmentClasses, TableStateHandlerService } from "./table-state-handler.service";

describe("services >", () => {
    describe("table-state-handler >", () => {
        const columnReorderTestCases = [
            { dragCell: 0, dropCell: 1, dropCellWidth: 100, dropCellOffsetX: 10,  expectedResult: ["first", "second", "third"] },
            { dragCell: 0, dropCell: 1, dropCellWidth: 100, dropCellOffsetX: 90,  expectedResult: ["second", "first", "third"] },
            { dragCell: 1, dropCell: 0, dropCellWidth: 200, dropCellOffsetX: 190, expectedResult: ["first", "second", "third"] },
            { dragCell: 1, dropCell: 0, dropCellWidth: 200, dropCellOffsetX: 90,  expectedResult: ["second", "first", "third"] },
            { dragCell: 0, dropCell: 2, dropCellWidth: 100, dropCellOffsetX: 49,  expectedResult: ["second", "first", "third"] },
            { dragCell: 0, dropCell: 2, dropCellWidth: 100, dropCellOffsetX: 51,  expectedResult: ["second", "third", "first"] },
            { dragCell: 2, dropCell: 0, dropCellWidth: 200, dropCellOffsetX: 101, expectedResult: ["first", "third", "second"] },
            { dragCell: 2, dropCell: 0, dropCellWidth: 200, dropCellOffsetX: 99,  expectedResult: ["third", "first", "second"] },
        ];

        let serviceInstance: TableStateHandlerService;

        beforeEach(() => {
            serviceInstance = new TableStateHandlerService(NgZone as any, SelectorService as any);
            serviceInstance.tableColumns = ["first", "second", "third"];
        });

        it("Should provide correct class for right alignment", () => {
            const calculatedAlignment = serviceInstance.defineAlignment(42);
            expect(calculatedAlignment).toEqual(AlignmentClasses.RIGHT);
        });

        it("Should store a state of a column alignment", () => {
            serviceInstance.setAlignment("myColumn", AlignmentClasses.CENTER);
            expect(serviceInstance.getAlignment("myColumn")).toEqual(AlignmentClasses.CENTER);
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
                    expect(serviceInstance.tableColumns).toEqual(test.expectedResult);
                });
            });
        });

        describe("columns sorting >", () => {
            beforeEach(() => {
                serviceInstance.sortable = true;
            });

            it("should properly apply sorting direction", () => {
                const tableStateSpy = spyOn(serviceInstance.sortingState, "next").and.callThrough();
                serviceInstance.sortColumn(0);
                expect(tableStateSpy).toHaveBeenCalledWith(TableSpecHelpers.getColumnSortTestStates()[0]);
                serviceInstance.sortColumn(0);
                expect(tableStateSpy).toHaveBeenCalledWith(TableSpecHelpers.getColumnSortTestStates()[1]);
                serviceInstance.sortColumn(1);
                expect(tableStateSpy).toHaveBeenCalledWith(TableSpecHelpers.getColumnSortTestStates()[2]);
                serviceInstance.sortColumn(1);
                expect(tableStateSpy).toHaveBeenCalledWith(TableSpecHelpers.getColumnSortTestStates()[3]);
            });
        });

        describe("columns resizing >", () => {
            beforeEach(() => {
                serviceInstance.resizable = true;
            });

            it("should calculate width of columns only once", () => {
                const calculateWidth = spyOn(serviceInstance, "calculateWidthsOfColumns").and.callThrough();
                expect(serviceInstance.getColumnWidth("first")).toBeGreaterThanOrEqual(46);
                expect(calculateWidth).toHaveBeenCalled();
                expect(serviceInstance.getColumnWidth("second")).toBeGreaterThanOrEqual(46);
                expect(calculateWidth.calls.count()).toBeLessThan(2);
            });

            it("calculation of columns should be performed once", () => {
                serviceInstance.tableColumns = ["first", "second"];
                const calculateWidthsOfColumnsSpy = spyOn(serviceInstance, "calculateWidthsOfColumns").and.callThrough();
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
                const firstColumnWidth = serviceInstance.getColumnWidth("first");
                const secondColumnWidth = serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(50);
                expect(secondColumnWidth).toEqual(expectedWidthConsideringBorder);
            });

            it("width of columns should be distributed equally", () => {
                const expectedWidthConsideringBorder = 99;
                serviceInstance.tableColumns = ["first", "second"];
                serviceInstance.tableParentWidth = 200;
                serviceInstance.calculateWidthsOfColumns();
                const firstColumnWidth = serviceInstance.getColumnWidth("first");
                const secondColumnWidth = serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(expectedWidthConsideringBorder);
                expect(secondColumnWidth).toEqual(expectedWidthConsideringBorder);
            });

            it("should take in consideration non-resizable columns of type 'icon' when calculating columns widths", () => {
                const expectedWidthConsideringBorder = 159;
                serviceInstance.tableColumns = ["first", "second"];
                serviceInstance.columnType = {columnName: "first", columnType: "icon"};
                serviceInstance.tableParentWidth = 200;
                serviceInstance.calculateWidthsOfColumns();
                const firstColumnWidth = serviceInstance.getColumnWidth("first");
                const secondColumnWidth = serviceInstance.getColumnWidth("second");
                expect(firstColumnWidth).toEqual(ICON_CELL_WIDTH_PX);
                expect(secondColumnWidth).toEqual(expectedWidthConsideringBorder);
            });
        });
    });
});
