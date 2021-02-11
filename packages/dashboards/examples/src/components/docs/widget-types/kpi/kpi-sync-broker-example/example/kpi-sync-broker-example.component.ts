import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { DataSourceService, IDataField, IFilteringOutputs } from "@nova-ui/bits";
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import {
    DATA_SOURCE,
    IBrokerUserConfig,
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
    WidgetTypesService
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

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
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

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
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

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            of(3381342)
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
    selector: "kpi-sync-broker-example",
    templateUrl: "./kpi-sync-broker-example.component.html",
    styleUrls: ["./kpi-sync-broker-example.component.less"],
})
export class KpiSyncBrokerExampleComponent implements OnInit {
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

    private setupDashboard() {
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        // removing broadcaster because of dataFields approach used in the dataSource
        delete widgetTemplate?.configurator?.[PizzagnaLayer.Structure].tiles?.properties?.template[1].providers[WellKnownProviders.Broadcaster];

        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [AverageRatingKpiDataSource.providerId, RatingsCountKpiDataSource.providerId, MockKpiDataSource.providerId]
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


    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
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
                x: 0,
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
                        "title": "NO Sync Broker",
                        "subtitle": "Values sizes are being not synced",
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
                        "title": "WITH Sync Broker",
                        "subtitle": "Now the values of label, units, and value are being synced",
                    },
                },
                "tiles": {
                    "properties": {
                        "nodes": ["kpi4", "kpi5", "kpi6"],
                    },
                    "providers": {
                        // This is where and how you set the sync broker provider
                        kpiScaleSyncBroker: {
                            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
                            properties: {
                                scaleSyncConfig: [
                                    // You can decide which values to keep in sync. For instance, you can leave only 'label' id in the array below
                                    { id: "value" },
                                    { id: "label" },
                                    { id: "units" },
                                ],
                            },
                        },
                    },
                },
                "kpi4": {
                    "id": "kpi4",
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
                                "componentId": "kpi4",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi5": {
                    "id": "kpi5",
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
                                "componentId": "kpi5",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
                "kpi6": {
                    "id": "kpi6",
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
                                "componentId": "kpi6",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                },
            },
        },
    },
];
