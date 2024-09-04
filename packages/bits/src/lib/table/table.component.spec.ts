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

import { CdkTableModule } from "@angular/cdk/table";
import { NO_ERRORS_SCHEMA, SimpleChanges, Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableHeaderCellComponent } from "./table-cell/table-header-cell.component";
import {
    TableFooterRowComponent,
    TableFooterRowDefDirective,
    TableHeaderRowComponent,
    TableHeaderRowDefDirective,
    TableRowComponent,
    TableRowDefDirective,
} from "./table-row/table-row.component";
import {
    DraggableTableComponent,
    PinnedHeaderTableComponent,
    ResizeTableComponent,
    RowDensityTableComponent,
    SortableTableComponent,
    TableSelectTestComponent,
} from "./table-spec-helpers";
import { TableSpecHelpers } from "./table-spec-helpers/table-spec-helpers";
import { TableStateHandlerService } from "./table-state-handler.service";
import { TableComponent } from "./table.component";
import {
    ClickableRowOptions,
    SelectorService,
    TableCellDefDirective,
    TableCellDirective,
    TableColumnDefDirective,
    TableFooterCellDefDirective,
    TableFooterCellDirective,
    TableHeaderCellDefDirective,
    TableSelectionConfig,
    TableSelectionMode,
    UtilService,
} from "../../public_api";
import { ISelection } from "../../services/public-api";
import { SorterDirection } from "../sorter/public-api";

describe("components >", () => {
    let fixture: ComponentFixture<any>;
    let component: any;
    let tableElement: HTMLElement;
    let tableStateHandlerService: TableStateHandlerService;

    describe("table >", () => {
        function createComponent<T>(
            componentType: Type<T>
        ): ComponentFixture<T> {
            TestBed.configureTestingModule({
                imports: [CdkTableModule],
                declarations: [
                    componentType,
                    TableComponent,
                    TableCellDefDirective,
                    TableHeaderCellDefDirective,
                    TableColumnDefDirective,
                    TableHeaderCellComponent,
                    TableCellDirective,
                    TableRowComponent,
                    TableHeaderRowDefDirective,
                    TableRowDefDirective,
                    TableHeaderRowComponent,
                    TableFooterCellDefDirective,
                    TableFooterCellDirective,
                    TableFooterRowDefDirective,
                    TableFooterRowComponent,
                ],
                providers: [
                    UtilService,
                    SelectorService,
                    TableStateHandlerService,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            return TestBed.createComponent<T>(componentType);
        }

        function setupTableTestApp(componentType: Type<any>) {
            fixture = createComponent(componentType);
            component = fixture.componentInstance;
            fixture.detectChanges();
            tableElement =
                fixture.nativeElement.querySelector(".nui-table__table");
        }

        function setTableSelectionConfiguration(
            config: boolean | TableSelectionMode
        ): void {
            if (typeof config === "boolean") {
                component.selectable = config;
                component.selectionConfig = null;
            } else {
                component.selectable = config;
                component.selectionConfig = {
                    enabled: true,
                    selectionMode: config,
                };
            }
            fixture.detectChanges();
        }

        describe("pinned header table >", () => {
            beforeEach(() => {
                setupTableTestApp(PinnedHeaderTableComponent);
                component =
                    fixture.componentInstance as PinnedHeaderTableComponent;
                fixture.detectChanges();
            });

            it("should have sticky position when sticky is true", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                const headerCells = TableSpecHelpers.getHeaderCells(headerRow);
                headerCells.forEach((cell) => {
                    expect(
                        window
                            .getComputedStyle(cell)
                            .getPropertyValue("position")
                    ).toBe("sticky");
                });
            });

            it("should have sticky cdk-table-sticky class when sticky is true", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                const headerCells = TableSpecHelpers.getHeaderCells(headerRow);
                headerCells.forEach((cell) => {
                    expect(
                        cell.classList.contains("cdk-table-sticky")
                    ).toBeTruthy();
                });
            });

            it("should not have sticky position when sticky is false", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                const headerCells = TableSpecHelpers.getHeaderCells(headerRow);
                expect(component.isSticky).toBeTruthy();
                component.setStickyFalse();
                expect(component.isSticky).toBeFalsy();
                fixture.detectChanges();
                headerCells.forEach((cell) => {
                    expect(
                        window
                            .getComputedStyle(cell)
                            .getPropertyValue("position")
                    ).toBe("static");
                });
            });

            it("should not have sticky cdk-table-sticky class when sticky is false", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                const headerCells = TableSpecHelpers.getHeaderCells(headerRow);
                expect(component.isSticky).toBeTruthy();
                component.setStickyFalse();
                expect(component.isSticky).toBeFalsy();
                fixture.detectChanges();
                headerCells.forEach((cell) => {
                    expect(
                        cell.classList.contains("cdk-table-sticky")
                    ).toBeFalsy();
                });
            });
        });

        describe("drag and drop table >", () => {
            const columnReorderTestCases =
                TableSpecHelpers.getColumnReorderTestCases();
            const basicTableCase = TableSpecHelpers.basicTableCase();

            beforeEach(() => {
                setupTableTestApp(DraggableTableComponent);
                component =
                    fixture.componentInstance as DraggableTableComponent;
                fixture.detectChanges();
            });

            it("should have draggable=true attribute on every th", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                TableSpecHelpers.getHeaderCells(headerRow).forEach(
                    (headerCell) => {
                        expect(
                            headerCell.getAttribute("draggable")
                        ).toBeTruthy();
                    }
                );
            });

            it("should have nui-table__table-header-cell--reorderable css class on every th", () => {
                const headerRow: Element | undefined =
                    TableSpecHelpers.getHeaderRow(tableElement) ?? undefined;
                if (!headerRow) {
                    throw new Error("headerRow is not defined");
                }
                TableSpecHelpers.getHeaderCells(headerRow).forEach(
                    (headerCell) => {
                        expect(headerCell.classList).toContain(
                            `nui-table__table-header-cell--reorderable`
                        );
                    }
                );
            });

            it("should have nui-table__table-row_height_default class set on nui-row element by default, if density attribute is not specified", () => {
                const tableRows = TableSpecHelpers.getRows(tableElement);
                tableRows.forEach((row) => {
                    expect(
                        row.classList.contains(
                            "nui-table__table-row_height_default"
                        )
                    ).toBe(true);
                });
            });

            describe("columns reorder >", () => {
                columnReorderTestCases.forEach((test) => {
                    it(`should reorder columns when dragging from cell #${test.dragCellIndex} to cell#${test.dropCellIndex}
                    when drop position is ${test.offsetX}px and cell width is ${test.clientWidth}px`, () => {
                        const headerRow: Element | undefined =
                            TableSpecHelpers.getHeaderRow(tableElement) ??
                            undefined;
                        if (!headerRow) {
                            throw new Error("headerRow is not defined");
                        }
                        const dragCell =
                            TableSpecHelpers.getHeaderCells(headerRow)[
                                test.dragCellIndex
                            ];
                        const dropCell =
                            TableSpecHelpers.getHeaderCells(headerRow)[
                                test.dropCellIndex
                            ];
                        TableSpecHelpers.dragElement(
                            dragCell,
                            test.dragCellIndex
                        );
                        fixture.detectChanges();
                        TableSpecHelpers.dropElement(
                            dropCell,
                            test.offsetX,
                            test.clientWidth,
                            test.dragCellIndex,
                            test.dropCellIndex
                        );
                        fixture.detectChanges();
                        TableSpecHelpers.expectTableToMatchContent(
                            tableElement,
                            test.expectedResult
                        );
                    });
                });

                it("shouldn't crash table, if foreign element is dropped on table header row", () => {
                    const headerRow: Element | undefined =
                        TableSpecHelpers.getHeaderRow(tableElement) ??
                        undefined;
                    if (!headerRow) {
                        throw new Error("headerRow is not defined");
                    }
                    const dragElement: Element = document.createElement("p");
                    dragElement.innerHTML =
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
                    const dropCell =
                        TableSpecHelpers.getHeaderCells(headerRow)[
                            basicTableCase.dropCellIndex
                        ];
                    TableSpecHelpers.dragElement(dragElement, -1);
                    fixture.detectChanges();
                    TableSpecHelpers.dropElement(
                        dropCell,
                        basicTableCase.offsetX,
                        basicTableCase.clientWidth,
                        -1,
                        basicTableCase.dropCellIndex
                    );
                    fixture.detectChanges();
                    TableSpecHelpers.expectTableToMatchContent(
                        tableElement,
                        basicTableCase.expectedResult
                    );
                });
            });
        });

        describe("row density table >", () => {
            beforeEach(() => {
                setupTableTestApp(RowDensityTableComponent);
                component =
                    fixture.componentInstance as RowDensityTableComponent;
                fixture.detectChanges();
            });

            it("should have nui-row element with density attribute set to tiny", async () => {
                const tableRows = TableSpecHelpers.getRows(tableElement);
                tableRows.forEach((row) => {
                    expect(row.getAttribute("density")).toEqual("tiny");
                });
            });

            it("should have nui-table__table-row_height_tiny class set on nui-row element with density=tiny", async () => {
                const tableRows = TableSpecHelpers.getRows(tableElement);
                tableRows.forEach((row) => {
                    expect(
                        row.classList.contains(
                            "nui-table__table-row_height_tiny"
                        )
                    ).toBe(true);
                });
            });
        });

        describe("sorting >", () => {
            beforeEach(() => {
                setupTableTestApp(SortableTableComponent);
                component = fixture.componentInstance as SortableTableComponent;
                fixture.detectChanges();
            });

            it("should emit correct sorting column and asc direction when sorting is fired on first column", async () => {
                spyOn(component.tableComponent.sortOrderChanged, "emit");
                (
                    component.tableComponent.tableStateHandlerService as any
                ).sortColumn(0);
                fixture.detectChanges();
                expect(
                    component.tableComponent.sortOrderChanged.emit
                ).toHaveBeenCalledWith({
                    sortBy: "position",
                    direction: SorterDirection.ascending,
                });
            });

            it("should emit correct sorting column and asc direction when sorting is fired on last column", async () => {
                spyOn(component.tableComponent.sortOrderChanged, "emit");
                (
                    component.tableComponent.tableStateHandlerService as any
                ).sortColumn(3);
                fixture.detectChanges();
                expect(
                    component.tableComponent.sortOrderChanged.emit
                ).toHaveBeenCalledWith({
                    sortBy: "location",
                    direction: SorterDirection.ascending,
                });
            });

            it("should emit correct sorting column and asc direction when sorting is fired in the middle", async () => {
                spyOn(component.tableComponent.sortOrderChanged, "emit");
                (
                    component.tableComponent.tableStateHandlerService as any
                ).sortColumn(2);
                fixture.detectChanges();
                expect(
                    component.tableComponent.sortOrderChanged.emit
                ).toHaveBeenCalledWith({
                    sortBy: "asset",
                    direction: SorterDirection.ascending,
                });
            });

            it("should emit correct sorting column and desc direction when sorting is fired 2 times", async () => {
                spyOn(component.tableComponent.sortOrderChanged, "emit");
                (
                    component.tableComponent.tableStateHandlerService as any
                ).sortColumn(2);
                (
                    component.tableComponent.tableStateHandlerService as any
                ).sortColumn(2);
                fixture.detectChanges();
                expect(
                    component.tableComponent.sortOrderChanged.emit
                ).toHaveBeenCalledWith({
                    sortBy: "asset",
                    direction: SorterDirection.descending,
                });
            });

            it("should set datasource to empty array if passed null", () => {
                const changes: SimpleChanges = {
                    dataSource: {
                        previousValue: TableSpecHelpers.getTableInitialData(),
                        currentValue: null,
                        firstChange: false,
                        isFirstChange: (): boolean => false,
                    },
                };
                component.tableComponent.ngOnChanges(changes);
                fixture.detectChanges();
                expect(component.tableComponent.dataSource).toEqual([]);
            });

            it("should set datasource to empty array if passed undefined", () => {
                const changes: SimpleChanges = {
                    dataSource: {
                        previousValue: TableSpecHelpers.getTableInitialData(),
                        currentValue: undefined,
                        firstChange: false,
                        isFirstChange: (): boolean => false,
                    },
                };
                component.tableComponent.ngOnChanges(changes);
                fixture.detectChanges();
                expect(component.tableComponent.dataSource).toEqual([]);
            });
        });

        describe("selecting rows >", () => {
            const SELECTION: ISelection = {
                isAllPages: false,
                include: [],
                exclude: [],
            };

            beforeEach(() => {
                setupTableTestApp(TableSelectTestComponent);
                component =
                    fixture.componentInstance as TableSelectTestComponent;
                fixture.detectChanges();
            });

            [
                {
                    name: "selectable",
                    config: true,
                },
                {
                    name: "selectionConfig.Multi",
                    config: TableSelectionMode.Multi,
                },
                {
                    name: "selectionConfig.Radio",
                    config: TableSelectionMode.Radio,
                },
            ].forEach(({ name, config }) => {
                it(`should add first header cell with selector [${name}]`, () => {
                    setTableSelectionConfiguration(config);
                    const headerRow: Element | undefined =
                        TableSpecHelpers.getHeaderRow(tableElement) ??
                        undefined;
                    if (!headerRow) {
                        throw new Error("headerRow is not defined");
                    }
                    const headerCell =
                        TableSpecHelpers.getHeaderCells(headerRow)[0];
                    expect(
                        headerCell.classList.contains(
                            "nui-table__table-header-cell--selectable"
                        )
                    ).toBeTruthy();
                });

                it(`should add first column with checkbox [${name}]`, () => {
                    setTableSelectionConfiguration(config);
                    const rows = TableSpecHelpers.getRows(tableElement);
                    rows.forEach((row) => {
                        expect(
                            TableSpecHelpers.getCells(
                                row
                            )[0].classList.contains(
                                "nui-table__table-cell--selectable"
                            )
                        ).toBeTruthy();
                    });
                });
            });

            [
                {
                    name: "selectable",
                    config: true,
                },
                {
                    name: "selectionConfig.Multi",
                    config: TableSelectionMode.Multi,
                },
                {
                    name: "selectionConfig.Radio",
                    config: TableSelectionMode.Radio,
                },
                {
                    name: "selectionConfig.Single",
                    config: TableSelectionMode.Single,
                },
            ].forEach(({ name, config }) => {
                it(`should emit selection from table on (rowsSelected) output [${name}]`, () => {
                    setTableSelectionConfiguration(config);
                    spyOn(component, "onSelectorChange").and.callThrough();
                    (
                        component.tableComponent.tableStateHandlerService as any
                    ).selectionChanged.next(SELECTION);
                    fixture.detectChanges();
                    expect(component.onSelectorChange).toHaveBeenCalledWith(
                        SELECTION
                    );
                });
            });

            describe("sticky header >", () => {
                it("first cell should not contain cdk-table-sticky class when sticky is false", () => {
                    const headerRow: Element | undefined =
                        TableSpecHelpers.getHeaderRow(tableElement) ??
                        undefined;
                    if (!headerRow) {
                        throw new Error("headerRow is not defined");
                    }
                    const headerCell =
                        TableSpecHelpers.getHeaderCells(headerRow)[0];
                    expect(headerCell.classList).not.toContain(
                        `cdk-table-sticky`
                    );
                });

                it("first cell should contain cdk-table-sticky class when sticky is true", () => {
                    const headerRow: Element | undefined =
                        TableSpecHelpers.getHeaderRow(tableElement) ??
                        undefined;
                    if (!headerRow) {
                        throw new Error("headerRow is not defined");
                    }
                    const headerCell =
                        TableSpecHelpers.getHeaderCells(headerRow)[0];
                    component.isSticky = true;
                    fixture.detectChanges();
                    expect(headerCell.classList).toContain(`cdk-table-sticky`);
                });

                it("first cell should have sticky position when sticky is true", () => {
                    const headerRow: Element | undefined =
                        TableSpecHelpers.getHeaderRow(tableElement) ??
                        undefined;
                    if (!headerRow) {
                        throw new Error("headerRow is not defined");
                    }
                    const headerCell =
                        TableSpecHelpers.getHeaderCells(headerRow)[0];
                    component.isSticky = true;
                    fixture.detectChanges();
                    expect(
                        window
                            .getComputedStyle(headerCell)
                            .getPropertyValue("position")
                    ).toBe("sticky");
                });
            });
        });

        describe("clickable rows >", () => {
            const constructEventTarget = (clickable: any, ignored: any) => ({
                closest: (query: string) => {
                    const config: ClickableRowOptions =
                        fixture.componentInstance.clickableRowConfig;
                    if (query === config.clickableSelectors.join(",")) {
                        return clickable;
                    }
                    if (query === config.ignoredSelectors.join(",")) {
                        return ignored;
                    }
                    return null;
                },
            });

            beforeEach(() => {
                setupTableTestApp(TableRowComponent);
                component = fixture.componentInstance as TableRowComponent;
                fixture.detectChanges();
                tableStateHandlerService = TestBed.inject(
                    TableStateHandlerService
                );
            });

            it("should emit selection from table on row click if clickable rows enabled", () => {
                spyOn(component, "rowSelected");
                spyOnProperty(
                    tableStateHandlerService,
                    "selectionEnabled",
                    "get"
                ).and.returnValue(true);
                fixture.componentInstance.clickableRow = true;

                const selectionElement = {};
                component.rowSelectionElement = {
                    nativeElement: selectionElement,
                };
                const eventTarget = constructEventTarget(
                    { querySelector: () => selectionElement },
                    null
                );

                fixture.componentInstance.rowClickHandler(
                    <HTMLElement>eventTarget
                );
                expect(component.rowSelected).toHaveBeenCalled();
            });

            it("should emit selection from table on row click if clickable rows enabled [selectionConfig.Single]", () => {
                component.selectable = false;
                component.selectionConfig = {
                    enabled: true,
                    selectionMode: TableSelectionMode.Single,
                };
                spyOn(component, "rowSelected");
                spyOnProperty(
                    tableStateHandlerService,
                    "selectionEnabled",
                    "get"
                ).and.returnValue(true);
                fixture.componentInstance.clickableRow = true;

                const selectionElement = {};
                component.rowSelectionElement = {
                    nativeElement: selectionElement,
                };
                const eventTarget = constructEventTarget(
                    { querySelector: () => selectionElement },
                    null
                );

                fixture.componentInstance.rowClickHandler(
                    <HTMLElement>eventTarget
                );
                expect(component.rowSelected).toHaveBeenCalled();
            });

            it("should not emit selection from table on row click if clickable rows enabled but an ignored element was clicked", () => {
                spyOn(component, "rowSelected");
                spyOnProperty(
                    tableStateHandlerService,
                    "selectionEnabled",
                    "get"
                ).and.returnValue(true);
                fixture.componentInstance.clickableRow = true;

                const eventTarget = constructEventTarget(
                    { querySelector: () => ({}) },
                    {}
                );

                fixture.componentInstance.rowClickHandler(
                    <HTMLElement>eventTarget
                );
                expect(component.rowSelected).not.toHaveBeenCalled();
            });

            it("should not emit selection from an unselectable table", () => {
                spyOn(component, "rowSelected");
                spyOnProperty(
                    tableStateHandlerService,
                    "selectionEnabled",
                    "get"
                ).and.returnValue(false);
                fixture.componentInstance.clickableRow = true;

                const eventTarget = constructEventTarget({}, {});

                fixture.componentInstance.rowClickHandler(
                    <HTMLElement>eventTarget
                );
                expect(component.rowSelected).not.toHaveBeenCalled();
            });

            it("should not emit selection from a selectable table when clickable rows are not enabled", () => {
                spyOn(component, "rowSelected");
                spyOnProperty(
                    tableStateHandlerService,
                    "selectionEnabled",
                    "get"
                ).and.returnValue(true);
                fixture.componentInstance.clickableRow = false;

                const eventTarget = constructEventTarget({}, {});

                fixture.componentInstance.rowClickHandler(
                    <HTMLElement>eventTarget
                );
                expect(component.rowSelected).not.toHaveBeenCalled();
            });
        });
        describe("columns types >", () => {
            describe("icon >", () => {
                beforeEach(() => {
                    setupTableTestApp(TableSelectTestComponent);
                    component =
                        fixture.componentInstance as TableSelectTestComponent;
                    fixture.detectChanges();
                });

                it("should contain proper classes when column type is 'icon'", () => {
                    const iconTypeHeaderCell = TableSpecHelpers.getElement(
                        tableElement,
                        "#column-of-type-icon"
                    );
                    expect(iconTypeHeaderCell?.classList).toContain(
                        "nui-table__icon-cell"
                    );
                    expect(iconTypeHeaderCell?.classList).toContain(
                        "align-center"
                    );
                });
            });
        });

        describe("resizable table", () => {
            beforeEach(() => {
                setupTableTestApp(ResizeTableComponent);
            });

            it("should not have horizontal scroll if selectable", () => {
                const tableContainer = component.tableContainer.nativeElement;
                expect(tableContainer.scrollWidth).toBe(
                    tableContainer.clientWidth
                );
            });
        });
    });
});
