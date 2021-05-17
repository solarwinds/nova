import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService, IFilteringOutputs } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IKpiData,
    IProviderConfiguration,
    IWidget,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    NOVA_KPI_SCALE_SYNC_BROKER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import keyBy from "lodash/keyBy";
import { BehaviorSubject, of } from "rxjs";
import { delay, finalize, take } from "rxjs/operators";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AverageRatingKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "AverageRatingKpiDataSource";
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            // *** Make a resource request to an external API (if needed)
            this.http.get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.averageRating,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

/**
 * A simple KPI data source to retrieve the ratings count of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class RatingsCountKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "RatingsCountKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http.get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
                .pipe(
                    delay(2000),
                    finalize(() => this.busy.next(false))
                )
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.ratingsCount,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
/**
 * A simple KPI data source to retrieve the ratings count of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class MockKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "MockKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);
    public value: number = 3381342;

    constructor() {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            of(this.value)
                .pipe(
                    delay(5000),
                    take(1),
                    finalize(() => this.busy.next(false))
                )
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "kpi-sync-broker-for-all-tiles-example",
    templateUrl: "./kpi-sync-broker-for-all-tiles-example.component.html",
    styleUrls: ["./kpi-sync-broker-for-all-tiles-example.component.less"],
})
export class KpiSyncBrokerForAllTilesExampleComponent implements OnInit {
    public dashboard: IDashboard | undefined;
    public gridsterConfig: GridsterConfig = {};
    public editMode: boolean = false;

    constructor(
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        this.setupDashboard();

        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    private setupDashboard() {
        // To add the sync broker globally to all the kpi tiles you may start with setting up the broker config
        // Here you define which values to keep in sync
        const brokerConfig = {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value" },
                    { id: "label" },
                    { id: "units" },
                ],
            },
        };
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [AverageRatingKpiDataSource.providerId, RatingsCountKpiDataSource.providerId, MockKpiDataSource.providerId]
        );

        // And here is how you set the sync broker for every KPI widget in the dashboard.
        // Later, you will be able to override this setting for each separate KPI widget in the configuration (just like it is shown in the third
        // width of the example with the 'kpiWidgetId3')
        this.widgetTypesService.setNode(
            widgetTemplate,
            "widget",
            "tiles.providers.kpiScaleSyncBroker",
            brokerConfig
        );

        this.providerRegistry.setProviders({
            [AverageRatingKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AverageRatingKpiDataSource,
                deps: [HttpClient],
            },
            [RatingsCountKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RatingsCountKpiDataSource,
                deps: [HttpClient],
            },
            [MockKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: MockKpiDataSource,
                deps: [],
            },
        });
    }

    private initializeDashboard(): void {
        const widgetsWithStructure = widgetsConfig.map(w => this.widgetTypesService.mergeWithWidgetType(w));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        const positions: Record<string, GridsterItem> = {
            "kpiWidgetId": {
                cols: 3,
                rows: 6,
                y: 0,
                x: 0,
            },
            "kpiWidgetId2": {
                cols: 3,
                rows: 6,
                y: 0,
                x: 3,
            },
            "kpiWidgetId3": {
                cols: 3,
                rows: 6,
                y: 0,
                x: 6,
            },
        };

        this.dashboard = {
            positions,
            widgets: widgetsIndex,
        };
    }

}

const widgetsConfig: IWidget[] = [
    {
        id: "kpiWidgetId",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Sync Broker Applied for ALL Widgets",
                        "subtitle": "Values are being synced",
                    },
                },
                "tiles": {
                    "properties": {
                        "nodes": ["kpi1", "kpi2", "kpi3"],
                    },
                },
                "kpi1": {
                    "id": "kpi1",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "units": `out of 5 Stars`,
                            "label": `Average Rating`,
                            "backgroundColor": "lightpink",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AverageRatingKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi1",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi2": {
                    "id": "kpi2",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Another label which might be a pretty long one`,
                            "units": `Which comes from somewhere`,
                            "backgroundColor": "skyblue",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": RatingsCountKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi2",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi3": {
                    "id": "kpi3",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Random`,
                            "units": `Data`,
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": MockKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi3",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
            },
        },
    },
    {
        id: "kpiWidgetId2",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Sync Broker Applied for ALL Widgets",
                        "subtitle": "Now the values of label, units, and value are being synced",
                    },
                },
                "tiles": {
                    "properties": {
                        "nodes": ["kpi1", "kpi2", "kpi3"],
                    },
                },
                "kpi1": {
                    "id": "kpi1",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "units": `out of 5 Stars`,
                            "label": `Average Rating`,
                            "backgroundColor": "lightpink",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AverageRatingKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi1",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi2": {
                    "id": "kpi2",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Another label which might be a pretty long one`,
                            "units": `Which comes from somewhere`,
                            "backgroundColor": "skyblue",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": RatingsCountKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi2",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi3": {
                    "id": "kpi3",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Random`,
                            "units": `Data`,
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": MockKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi3",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
            },
        },
    },
    {
        id: "kpiWidgetId3",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Here We Sync Only Labels and Units",
                        "subtitle": "Now only the label, and units are being synced",
                    },
                },
                "tiles": {
                    "properties": {
                        "nodes": ["kpi1", "kpi2", "kpi3"],
                    },
                    "providers": {
                        // This is where and how you can override the globally set broker config
                        kpiScaleSyncBroker: {
                            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
                            properties: {
                                scaleSyncConfig: [
                                    { id: "label" },
                                    { id: "units" },
                                ],
                            },
                        },
                    },
                },
                "kpi1": {
                    "id": "kpi1",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "units": `out of 5 Stars`,
                            "label": `Average Rating`,
                            "backgroundColor": "lightpink",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AverageRatingKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi1",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi2": {
                    "id": "kpi2",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Another label which might be a pretty long one`,
                            "units": `Which comes from somewhere`,
                            "backgroundColor": "skyblue",
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": RatingsCountKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi2",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi3": {
                    "id": "kpi3",
                    "componentType": KpiComponent.lateLoadKey,
                    "properties": {
                        "widgetData": {
                            "label": `Random`,
                            "units": `Data`,
                        },
                    },
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": MockKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi3",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
            },
        },
    },
];
