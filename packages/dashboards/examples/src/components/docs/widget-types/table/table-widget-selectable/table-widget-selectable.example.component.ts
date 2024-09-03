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
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { LoggerService, TableSelectionMode } from "@nova-ui/bits";
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
    TableWidgetSelectionConfig,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeTableMockDataSource } from "../../../../prototypes/data/table/acme-table-mock-data-source.service";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "table-widget-selectable-example",
    templateUrl: "./table-widget-selectable.example.component.html",
    styleUrls: ["./table-widget-selectable.example.component.less"],
})
export class TableWidgetSelectableExampleComponent implements OnInit {
    public dashboard: IDashboard | undefined;
    public gridsterConfig: GridsterConfig = {};
    public editMode: boolean = false;

    @Input() public selectionConfiguration: TableWidgetSelectionConfig = {
        enabled: false,
        selectionMode: TableSelectionMode.None,
    };

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
        const tableWidget = this.widgetConfig;
        const widgetIndex: IWidgets = {
            [tableWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(tableWidget),
        };

        const positions: Record<string, GridsterItem> = {
            [tableWidget.id]: {
                cols: 12,
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

    private get widgetConfig(): IWidget {
        return {
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
                            title: "Table Widget with Selection!",
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
                                // enabling selection here
                                selectionConfiguration:
                                    this.selectionConfiguration,
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
                            } as ITableWidgetConfig,
                        },
                    },
                },
            },
        };
    }
}
