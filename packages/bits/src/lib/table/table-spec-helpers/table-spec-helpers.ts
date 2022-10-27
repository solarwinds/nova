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

import { SorterDirection } from "../../sorter/public-api";

interface TestTableModel {
    position: string;
    name: string;
    asset: string;
    location: string;
}

const ELEMENT_DATA: TestTableModel[] = [
    {
        position: "1",
        name: "FOCUS-SVR-02258",
        asset: "Workstation",
        location: "Brno",
    },
    {
        position: "2",
        name: "Man-LT-JYJ4AD5",
        asset: "Workstation",
        location: "Kiev",
    },
    {
        position: "3",
        name: "FOCUS-SVR-02258",
        asset: "Workstation",
        location: "New York",
    },
];

export class TableSpecHelpers {
    public static getTableInitialData() {
        return ELEMENT_DATA;
    }

    public static basicTableCase() {
        return {
            dropCellIndex: 1,
            offsetX: 15,
            clientWidth: 20,
            expectedResult: [
                ["No.", "Name", "Asset Class", "Location"],
                [
                    ELEMENT_DATA[0].position,
                    ELEMENT_DATA[0].name,
                    ELEMENT_DATA[0].asset,
                    ELEMENT_DATA[0].location,
                ],
                [
                    ELEMENT_DATA[1].position,
                    ELEMENT_DATA[1].name,
                    ELEMENT_DATA[1].asset,
                    ELEMENT_DATA[1].location,
                ],
                [
                    ELEMENT_DATA[2].position,
                    ELEMENT_DATA[2].name,
                    ELEMENT_DATA[2].asset,
                    ELEMENT_DATA[2].location,
                ],
            ],
        };
    }

    public static getColumnReorderTestCases() {
        return [
            {
                dragCellIndex: 0,
                dropCellIndex: 1,
                offsetX: 15,
                clientWidth: 20,
                expectedResult: [
                    ["Name", "No.", "Asset Class", "Location"],
                    [
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].asset,
                        ELEMENT_DATA[0].location,
                    ],
                    [
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].asset,
                        ELEMENT_DATA[1].location,
                    ],
                    [
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].asset,
                        ELEMENT_DATA[2].location,
                    ],
                ],
            },
            {
                dragCellIndex: 1,
                dropCellIndex: 2,
                offsetX: 10,
                clientWidth: 30,
                expectedResult: [
                    ["No.", "Name", "Asset Class", "Location"],
                    [
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].asset,
                        ELEMENT_DATA[0].location,
                    ],
                    [
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].asset,
                        ELEMENT_DATA[1].location,
                    ],
                    [
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].asset,
                        ELEMENT_DATA[2].location,
                    ],
                ],
            },
            {
                dragCellIndex: 1,
                dropCellIndex: 0,
                offsetX: 5,
                clientWidth: 30,
                expectedResult: [
                    ["Name", "No.", "Asset Class", "Location"],
                    [
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].asset,
                        ELEMENT_DATA[0].location,
                    ],
                    [
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].asset,
                        ELEMENT_DATA[1].location,
                    ],
                    [
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].asset,
                        ELEMENT_DATA[2].location,
                    ],
                ],
            },
            {
                dragCellIndex: 2,
                dropCellIndex: 1,
                offsetX: 60,
                clientWidth: 70,
                expectedResult: [
                    ["No.", "Name", "Asset Class", "Location"],
                    [
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].asset,
                        ELEMENT_DATA[0].location,
                    ],
                    [
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].asset,
                        ELEMENT_DATA[1].location,
                    ],
                    [
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].asset,
                        ELEMENT_DATA[2].location,
                    ],
                ],
            },
            {
                dragCellIndex: 0,
                dropCellIndex: 3,
                offsetX: 10,
                clientWidth: 50,
                expectedResult: [
                    ["Name", "Asset Class", "No.", "Location"],
                    [
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].asset,
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].location,
                    ],
                    [
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].asset,
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].location,
                    ],
                    [
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].asset,
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].location,
                    ],
                ],
            },
            {
                dragCellIndex: 3,
                dropCellIndex: 0,
                offsetX: 40,
                clientWidth: 100,
                expectedResult: [
                    ["Location", "No.", "Name", "Asset Class"],
                    [
                        ELEMENT_DATA[0].location,
                        ELEMENT_DATA[0].position,
                        ELEMENT_DATA[0].name,
                        ELEMENT_DATA[0].asset,
                    ],
                    [
                        ELEMENT_DATA[1].location,
                        ELEMENT_DATA[1].position,
                        ELEMENT_DATA[1].name,
                        ELEMENT_DATA[1].asset,
                    ],
                    [
                        ELEMENT_DATA[2].location,
                        ELEMENT_DATA[2].position,
                        ELEMENT_DATA[2].name,
                        ELEMENT_DATA[2].asset,
                    ],
                ],
            },
        ];
    }

    public static getColumnSortTestStates() {
        return [
            {
                sortBy: "first",
                direction: SorterDirection.ascending,
            },
            {
                sortBy: "first",
                direction: SorterDirection.descending,
            },
            {
                sortBy: "second",
                direction: SorterDirection.ascending,
            },
            {
                sortBy: "second",
                direction: SorterDirection.descending,
            },
        ];
    }

    public static dropElement(
        droppedElement: Element,
        offsetX: number,
        clientWidth: number,
        dragCellIndex: number,
        dropCellIndex: number
    ) {
        const dragover = new DragEvent("dragover");
        const drop = new DragEvent("drop");

        Object.defineProperty(dragover, "offsetX", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: offsetX,
        });

        Object.defineProperty(dragover, "target", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: {
                clientWidth: clientWidth,
                cellIndex: dropCellIndex,
            },
        });

        Object.defineProperty(drop, "dataTransfer", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: {
                types: ["text"],
                items: dragCellIndex.toString(),
                getData: () => drop.dataTransfer?.items,
            },
        });

        droppedElement.dispatchEvent(dragover);
        droppedElement.dispatchEvent(drop);
    }

    public static dragElement(draggedElement: Element, dragCellIndex: number) {
        const drag = new DragEvent("dragstart");

        Object.defineProperty(drag, "dataTransfer", {
            enumerable: true,
            writable: true,
            configurable: true,
            value: {
                types: ["text"],
                items: dragCellIndex.toString(),
                effectAllowed: "move",
                setData: () => {},
            },
        });

        draggedElement.dispatchEvent(drag);
    }

    public static getElements(element: Element, query: string): Element[] {
        return [].slice.call(element.querySelectorAll(query));
    }

    public static getElement(element: Element, query: string): Element | null {
        return element.querySelector(query);
    }

    public static getHeaderRow(tableElement: Element): Element | null {
        return tableElement.querySelector(".nui-table__table-header-row");
    }

    public static getRows(tableElement: Element): Element[] {
        return TableSpecHelpers.getElements(
            tableElement,
            ".nui-table__table-row"
        );
    }

    public static getCells(row: Element): Element[] {
        let cells;

        if (!row) {
            return [];
        }

        cells = TableSpecHelpers.getElements(row, "nui-table__table-cell");

        if (!cells.length) {
            cells = TableSpecHelpers.getElements(
                row,
                "td.nui-table__table-cell"
            );
        }

        return cells;
    }

    public static getHeaderCells(headerRow: Element): Element[] {
        let cells = TableSpecHelpers.getElements(
            headerRow,
            "nui-table__table-header-cell"
        );

        if (!cells.length) {
            cells = TableSpecHelpers.getElements(
                headerRow,
                "th.nui-table__table-header-cell"
            );
        }

        return cells;
    }

    public static getActualTableContent(tableElement: Element): string[][] {
        let actualTableContent: Element[][] = [];
        const headerRow: Element | null =
            TableSpecHelpers.getHeaderRow(tableElement);
        if (!headerRow) {
            throw new Error("HeaderRow is not defined");
        }
        actualTableContent.push(TableSpecHelpers.getHeaderCells(headerRow));

        // Check data row cells
        const rows = TableSpecHelpers.getRows(tableElement).map((row) =>
            TableSpecHelpers.getCells(row)
        );
        actualTableContent = actualTableContent.concat(rows);

        // Convert the nodes into their text content;
        // eslint-disable-next-line
        return actualTableContent.map((row) =>
            row.map((cell) => cell.textContent!.trim())
        );
    }

    public static expectTableToMatchContent(
        tableElement: Element,
        expected: any[]
    ) {
        const actual = TableSpecHelpers.getActualTableContent(tableElement);
        const missedExpectations: string[] = [];

        function checkCellContent(actualCell: string, expectedCell: string) {
            if (actualCell !== expectedCell) {
                missedExpectations.push(
                    `Expected cell contents to be ${expectedCell} but was ${actualCell}`
                );
            }
        }

        // Make sure the number of rows match
        if (actual.length !== expected.length) {
            missedExpectations.push(
                `Expected ${expected.length} total rows but got ${actual.length}`
            );
            fail(missedExpectations.join("\n"));
        }

        actual.forEach((row: any, rowIndex: number) => {
            const expectedRow = expected[rowIndex];

            // Make sure the number of cells match
            if (row.length !== expectedRow.length) {
                missedExpectations.push(
                    `Expected ${expectedRow.length} cells in row but got ${row.length}`
                );
                fail(missedExpectations.join("\n"));
            }

            row.forEach((actualCell: any, cellIndex: number) => {
                const expectedCell = expectedRow
                    ? expectedRow[cellIndex]
                    : null;
                checkCellContent(actualCell, expectedCell);
            });
        });

        if (missedExpectations.length) {
            fail(missedExpectations.join("\n"));
        }
    }
}
