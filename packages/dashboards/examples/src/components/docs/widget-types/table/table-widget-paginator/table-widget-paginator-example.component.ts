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

import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";

import { LoggerService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IProviderConfiguration,
    ITableWidgetConfig,
    IWidget,
    IWidgets,
    NOVA_URL_INTERACTION_HANDLER,
    PizzagnaLayer,
    ProviderRegistryService,
    RawFormatterComponent,
    ScrollType,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeTableMockDataSource } from "../../../../prototypes/data/table/acme-table-mock-data-source.service";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "table-widget-paginator-example",
    templateUrl: "./table-widget-paginator-example.component.html",
    styleUrls: ["./table-widget-paginator-example.component.less"],
    standalone: false,
})
export class TableWidgetPaginatorExampleComponent implements OnInit {
    public dashboard: IDashboard | undefined;
    public gridsterConfig: GridsterConfig = {};
    public editMode: boolean = false;

    constructor(
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "table",
            1
        );
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [AcmeTableMockDataSource.providerId]
        );

        this.providerRegistry.setProviders({
            [AcmeTableMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableMockDataSource,
                deps: [LoggerService, HttpClient],
            },
        });

        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        const tableWithPaginator = tableWidgetWithPaginator;
        const tableWithVirtualScroll = tableWidgetWithVirtualScroll;

        const widgetIndex: IWidgets = {
            [tableWithPaginator.id]:
                this.widgetTypesService.mergeWithWidgetType(tableWithPaginator),
            [tableWithVirtualScroll.id]:
                this.widgetTypesService.mergeWithWidgetType(
                    tableWithVirtualScroll
                ),
        };

        const positions: Record<string, GridsterItem> = {
            [tableWithPaginator.id]: {
                cols: 6,
                rows: 6,
                y: 0,
                x: 0,
            },
            [tableWithVirtualScroll.id]: {
                cols: 6,
                rows: 6,
                y: 0,
                x: 0,
            },
        };

        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }
}

export const tableWidgetWithPaginator: IWidget = {
    id: "widget1",
    type: "table",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.InteractionHandler]: {
                        providerId: NOVA_URL_INTERACTION_HANDLER,
                    },
                },
            },
            header: {
                properties: {
                    title: "Table Widget with paginator!",
                    subtitle: "Basic table widget",
                    collapsible: true,
                },
            },
            table: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: AcmeTableMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
                properties: {
                    configuration: {
                        interactive: true,
                        columns: [
                            {
                                id: "column1",
                                label: "No.",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "position",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column2",
                                label: "Name",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "name",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column3",
                                label: "Status",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "status",
                                        },
                                    },
                                },
                            },
                        ],
                        sorterConfiguration: {
                            descendantSorting: false,
                            sortBy: "column1",
                        },
                        scrollType: ScrollType.paginator,
                        paginatorConfiguration: {
                            pageSize: 5,
                            pageSizeSet: [5, 10, 20, 30],
                        },
                        hasVirtualScroll: false,
                        searchConfiguration: {
                            enabled: true,
                        },
                    } as ITableWidgetConfig,
                },
            },
        },
    },
};

export const tableWidgetWithVirtualScroll: IWidget = {
    id: "widget2",
    type: "table",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.InteractionHandler]: {
                        providerId: NOVA_URL_INTERACTION_HANDLER,
                    },
                },
            },
            header: {
                properties: {
                    title: "Table Widget with virtual scroll!",
                    subtitle: "Basic table widget",
                    collapsible: true,
                },
            },
            table: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: AcmeTableMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
                properties: {
                    configuration: {
                        interactive: true,
                        columns: [
                            {
                                id: "column1",
                                label: "No.",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "position",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column2",
                                label: "Name",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "name",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column3",
                                label: "Status",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "status",
                                        },
                                    },
                                },
                            },
                        ],
                        sorterConfiguration: {
                            descendantSorting: false,
                            sortBy: "column1",
                        },
                        hasVirtualScroll: true,
                        searchConfiguration: {
                            enabled: true,
                        },
                    } as ITableWidgetConfig,
                },
            },
        },
    },
};
