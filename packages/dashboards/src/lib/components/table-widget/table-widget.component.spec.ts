import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe } from "@angular/common";
import { Xliff } from "@angular/compiler";
import { SimpleChange, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
    EventBus,
    LocalFilteringDataSource,
    LoggerService,
    NuiBusyModule,
    NuiImageModule,
    NuiSpinnerModule,
    NuiTableModule,
    SearchService,
    SorterDirection,
    VirtualViewportManager
} from "@solarwinds/nova-bits";
import { INovaFilteringOutputs, INovaFilters } from "@solarwinds/nova-bits";
import { BehaviorSubject } from "rxjs";
import { skip, take, tap } from "rxjs/operators";

import { NuiDashboardsModule } from "../../dashboards.module";
import { mockLoggerService } from "../../mocks";
import { NuiPizzagnaModule } from "../../pizzagna/pizzagna.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import { REFRESH, SCROLL_NEXT_PAGE } from "../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";

import { TableWidgetComponent } from "./table-widget.component";
import { IDataField, ITableWidgetColumnConfig, ITableWidgetConfig } from "./types";

interface BasicTableModel {
    position: number;
    name: string;
    features: any;
    status: string;
    checks: any;
    "cpu-load": number;
    firstUrl: string;
    firstUrlLabel: string;
    secondUrl: string;
    secondUrlLabel: string;
}

class MockDatasource extends LocalFilteringDataSource<any> {
    public busy = new BehaviorSubject(true);
}

const oneDataFieldColumns: ITableWidgetColumnConfig[] = [
    {
        id: "column1",
        label: $localize`No`,
        isActive: true,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: { value: "position" },
            },
        },
        width: 100,
    },
    {
        id: "column2",
        label: $localize`Name`,
        isActive: true,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: { value: "name" },
            },
        },
        width: 200,
    },
];

const multipleDataFieldsColumns: ITableWidgetColumnConfig[] = [
    {
        id: "column1",
        label: $localize`No`,
        isActive: true,
        formatter: {
            componentType: "LinkFormatterComponent",
            properties: {
                dataFieldIds: { link: "firstUrl", value: "firstUrlLabel" },
            },
        },
    },
    {
        id: "column2",
        label: $localize`Name`,
        isActive: true,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: { value: "name" },
            },
        },
    },
];

const configuration: ITableWidgetConfig = {
    columns: [],
    sorterConfiguration: {
        descendantSorting: true,
        sortBy: "column1",
    },
    hasVirtualScroll: true,
};

const tableData: BasicTableModel[] = [
    {
        position: 1,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 2,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 3,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
];

const expectedColumnsMappingResults = {
    oneDataField: [
        { column1: { data: { value: 1 } }, column2: { data: { value: "FOCUS-SVR-02258" } }, __record: tableData[0] },
        { column1: { data: { value: 2 } }, column2: { data: { value: "FOCUS-SVR-03312" } }, __record: tableData[1] },
        { column1: { data: { value: 3 } }, column2: { data: { value: "FOCUS-SVR-02258" } }, __record: tableData[2] },
    ],
    multipleDataFields: [
        {
            column1: {
                data: { link: "https://en.wikipedia.org/wiki/Brno", value: "Brno" },
            },
            column2: { data: { value: "FOCUS-SVR-02258" } },
            __record: tableData[0],
        },
        {
            column1: {
                data: { link: "https://en.wikipedia.org/wiki/Brno", value: "Brno" },
            },
            column2: { data: { value: "FOCUS-SVR-03312" } },
            __record: tableData[1],
        },
        {
            column1: {
                data: { link: "https://en.wikipedia.org/wiki/Kyiv", value: "Kyiv" },
            },
            column2: { data: { value: "FOCUS-SVR-02258" } },
            __record: tableData[2],
        },
    ],
};

const dataFields: IDataField[] = [
    { id: "position", label: $localize`Position`, dataType: "number", sortable: true },
    { id: "name", label: $localize`Name`, dataType: "string", sortable: true },
    { id: "features", label: $localize`Features`, dataType: "icons", sortable: false },
    { id: "checks", label: $localize`Checks`, dataType: "iconAndText", sortable: true },
    { id: "status", label: $localize`Status`, dataType: "string", sortable: true },
];

describe("TableWidgetComponent", () => {
    let component: TableWidgetComponent;
    let fixture: ComponentFixture<TableWidgetComponent>;

    function createSimpleChanges(changedConfiguration: ITableWidgetConfig, changedDataFields: BasicTableModel[], changedWidgetData: IDataField[]) {
        const configurationChanges = new SimpleChange(undefined, changedConfiguration, false);
        const widgetDataChanges = new SimpleChange(undefined, changedDataFields, false);
        const dataFieldsChanges = new SimpleChange(undefined, changedWidgetData, false);
        return {
            configuration: configurationChanges,
            widgetData: widgetDataChanges,
            dataFields: dataFieldsChanges,
        };
    }

    function createWidgetDataSimpleChanges(changedWidgetData: BasicTableModel[]) {
        const widgetDataChanges = new SimpleChange(undefined, changedWidgetData, false);
        return { widgetData: widgetDataChanges };
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NuiTableModule,
                NuiSpinnerModule,
                NuiImageModule,
                ScrollingModule,
                NuiPizzagnaModule,
                NuiBusyModule,
                NuiDashboardsModule,
            ],
            declarations: [],
            providers: [
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useClass: MockDatasource,
                    deps: [SearchService],
                },
                PizzagnaService,
                DynamicComponentCreator,
                ProviderRegistryService,
                DatePipe,
                VirtualViewportManager,
                { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                { provide: TRANSLATIONS, useValue: Xliff },
                {
                    provide: LoggerService, useValue: mockLoggerService,
                },
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableWidgetComponent);
        component = fixture.componentInstance;
        component.widgetData = tableData;
        component.dataFields = dataFields;
        component.configuration = configuration;
        component.range = tableData.length;
        fixture.detectChanges();
    });

    describe("basic tests >", () => {
        it("should display table if widgetData and columns are available", () => {
            configuration.columns = oneDataFieldColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            expect(component.shouldDisplayTable()).toBe(true);
        });

        it("should not display table if no widgetData is available", () => {
            component.widgetData = [];
            expect(component.shouldDisplayTable()).toBe(false);
        });

        it("should not display table if no columns are available", () => {
            component.columns = [];
            expect(component.shouldDisplayTable()).toBe(false);
        });

        it("should not display table if no columns and widgetData are available", () => {
            component.columns = [];
            component.widgetData = [];
            expect(component.shouldDisplayTable()).toBe(false);
        });

        it("should properly apply sorting and emit refresh event", () => {
            spyOn((<any>component).eventBus.getStream(REFRESH), "next");
            configuration.columns = oneDataFieldColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            component.onSortOrderChanged({
                sortBy: "column1",
                direction: SorterDirection.ascending,
            });
            expect((<any>component).sorterValue).toEqual({ sortBy: "position", direction: "asc" });
            expect((<any>component).eventBus.getStream(REFRESH).next).toHaveBeenCalled();
        });

        it("should properly apply sorting and emit refresh event for multi-column formatters", () => {
            spyOn((<any>component).eventBus.getStream(REFRESH), "next");
            configuration.columns = multipleDataFieldsColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            component.onSortOrderChanged({
                sortBy: "column1",
                direction: SorterDirection.ascending,
            });
            expect((<any>component).sorterValue).toEqual({ sortBy: "firstUrlLabel", direction: "asc" });
            expect((<any>component).eventBus.getStream(REFRESH).next).toHaveBeenCalled();
        });

        it("should set the sortableSet based on the existing data fields", () => {
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            const expectedSortableSet: any = {};
            dataFields.forEach((df) => {
                expectedSortableSet[df.id] = df.sortable;
            });
            expect((<any>component).sortableSet).toEqual(expectedSortableSet);
        });

        it("should update the columns with a sortable value based on the existing data fields", () => {
            configuration.columns = oneDataFieldColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            const expectedColumns: ITableWidgetColumnConfig[] = [...component.columns];
            expectedColumns.forEach((col) => {
                col.sortable = (<any>component).sortableSet[col?.formatter?.properties?.dataFieldIds?.value];
            });
            expect(component.columns).toEqual(expectedColumns);
        });
    });


    describe("virtual scroll", () => {

        beforeEach(() => {
            if (!component.vscrollViewport) {
                throw new Error("CDK Viewport is not defined yet");
            }
            component.vscrollViewport.elementRef.nativeElement.style.height = "500px";
            component.vscrollViewport.checkViewportSize();
            fixture.detectChanges();
        });

        it("should trigger the datasource if the viewport size is larger than the number of items per fetch", (done: DoneFn) => {
            component.ngOnChanges(createWidgetDataSimpleChanges(tableData));
            fixture.detectChanges();
            component.eventBus.getStream(SCROLL_NEXT_PAGE).pipe(
                take(1),
                tap(() => {
                    expect(component.viewportManager.currentPageRange.start).toBeGreaterThan(0);
                    done();
                })
            ).subscribe();
        });

        it("should not trigger datasource if all items were loaded", () => {
            component.totalItems = tableData.length;
            spyOn((<any>component).eventBus.getStream(SCROLL_NEXT_PAGE), "next");
            component.ngOnChanges(createWidgetDataSimpleChanges(tableData));
            expect((<any>component).eventBus.getStream(SCROLL_NEXT_PAGE).next).not.toHaveBeenCalled();
        });

        it("should reset to first page when sorting order changed", (done: DoneFn) => {
            // Note: Simulating reset from data source adapter
            component.eventBus.getStream(REFRESH).pipe(
                take(1),
                tap(() => component.viewportManager.reset({ emitFirstPage: false }))
            ).subscribe();

            configuration.columns = oneDataFieldColumns;
            component.updateColumns(configuration);
            component.ngOnChanges(createWidgetDataSimpleChanges(tableData));
            fixture.detectChanges();

            if (!component.vscrollViewport) {
                throw new Error("CDK Viewport is not defined yet");
            }

            const pagesToFillTheViewport = Math.floor(component.vscrollViewport.getViewportSize() / component.rowHeight / tableData.length);

            component.eventBus.getStream(SCROLL_NEXT_PAGE).pipe(
                tap(() => {
                    // Note: Simulating data source response assignment
                    component.tableData = Array.from({ length: component.viewportManager.currentPageRange.end })
                        .map(() => tableData[0]);
                    fixture.detectChanges();
                }),
                skip(pagesToFillTheViewport),
                take(1),
                tap(() => {
                    // Note: Triggering sort to get the REFRESH EVENT
                    component.onSortOrderChanged({ direction: SorterDirection.ascending, sortBy: "column1" });
                    fixture.detectChanges();
                    expect(component.viewportManager.currentPageRange.start).toBe(0);
                    done();
                })
            ).subscribe();
        });

        it("should fill the viewport with the data if there are more items to be loaded", (done: DoneFn) => {
            component.ngOnChanges(createWidgetDataSimpleChanges(tableData));
            fixture.detectChanges();

            if (!component.vscrollViewport) {
                throw new Error("CDK Viewport is not defined yet");
            }

            const pagesToFillTheViewport = Math.floor(component.vscrollViewport.getViewportSize() / component.rowHeight / tableData.length);
            component.eventBus.getStream(SCROLL_NEXT_PAGE).pipe(
                tap(() => {
                    // Note: Simulating data source response assignment
                    component.tableData = Array.from({ length: component.viewportManager.currentPageRange.end })
                        .map(() => tableData[0]);
                    fixture.detectChanges();
                }),
                skip(pagesToFillTheViewport),
                take(1),
                tap(() => {
                    expect(component.viewportManager.currentPageRange.start).toBeGreaterThan(0);
                    done();
                })
            ).subscribe();
        });
    });

    describe("table columns mapping >", () => {
        it("should correctly map data with one data field", () => {
            configuration.columns = oneDataFieldColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            fixture.detectChanges();
            expect(component.tableData).toEqual(expectedColumnsMappingResults.oneDataField);
        });

        it("should correctly map data with multiple data fields", () => {
            configuration.columns = multipleDataFieldsColumns;
            component.ngOnChanges(createSimpleChanges(configuration, tableData, dataFields));
            fixture.detectChanges();
            expect(component.tableData).toEqual(expectedColumnsMappingResults.multipleDataFields);
        });
    });

    describe("table should update columns correctly >", () => {
        it("should properly set headers", () => {
            configuration.columns = oneDataFieldColumns;
            component.updateColumns(configuration);
            fixture.detectChanges();
            expect(component.headers).toEqual(["column1", "column2"]);
        });

        it("should properly set columns", () => {
            const expectedColumns: ITableWidgetColumnConfig[] = [
                {
                    id: "column1",
                    label: "No",
                    isActive: true,
                    formatter: {
                        componentType: "RawFormatterComponent",
                        properties: {
                            dataFieldIds: { value: "position" },
                        },
                    },
                    sortable: true,
                    width: 100,
                },
                {
                    id: "column2",
                    label: "Name",
                    isActive: true,
                    formatter: {
                        componentType: "RawFormatterComponent",
                        properties: {
                            dataFieldIds: { value: "name" },
                        },
                    },
                    sortable: true,
                    width: 200,
                },
            ];
            configuration.columns = oneDataFieldColumns;
            component.updateColumns(configuration);
            fixture.detectChanges();
            expect(component.columns).toEqual(expectedColumns);
        });

        it("should properly set columnsWidthMap", () => {
            configuration.columns = oneDataFieldColumns;
            component.updateColumns(configuration);
            fixture.detectChanges();
            expect(component.columnsWidthMap).toEqual(new Map([["column1", 100], ["column2", undefined]]));
        });
    });
});
