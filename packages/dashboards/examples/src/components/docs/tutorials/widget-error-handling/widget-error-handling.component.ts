import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import { DataSourceService, IFilteringOutputs } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    HttpStatusCode,
    IDashboard,
    IKpiData,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AverageRatingKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "AverageRatingKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
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
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class ErrorUnknownDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "ErrorUnknownDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return {
            // @ts-ignore: Mock
            result: null,
            error: { type: HttpStatusCode.Unknown },
        };
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

/**
 * A simple KPI data source to retrieve the ratings count of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class ErrorForbiddenDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "ErrorForbiddenDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        // generate a 403
        return new Promise((resolve) => {
            this.http.get("http://www.mocky.io/v2/5ecc724a3200000f0023614a?mocky-delay=4000ms")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
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
export class ErrorNotFoundDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "ErrorNotFoundDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        // generate a 404
        return new Promise((resolve) => {
            this.http.get("http://www.mocky.io/v2/5ec6bfd93200007800d75100?mocky-delay=1000ms")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
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
 * A component that instantiates the dashboard
 */
@Component({
    selector: "widget-error-handling",
    templateUrl: "./widget-error-handling.component.html",
    styleUrls: ["./widget-error-handling.component.less"],
})
export class WidgetErrorHandlingComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean which dashboard takes in as an input if its true it allows you to move widgets around.
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef

    ) { }

    public ngOnInit(): void {
        // Grab the widget's default template which will be needed as a parameter for setNode.
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);
        // Register our data sources as dropdown options in the widget editor/configurator
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same widget template modification.
        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            widgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change
            // the data source providers available for selection in the editor.
            WellKnownPathKey.DataSourceProviders,
            // We are setting the data sources available for selection in the editor
            [ErrorUnknownDataSource.providerId, ErrorForbiddenDataSource.providerId, ErrorNotFoundDataSource.providerId, AverageRatingKpiDataSource.providerId]
        );

        // Register the data sources available for injection into the KPI tiles.
        // Note: Each tile of a KPI widget is assigned its own instance of a data source
        this.providerRegistry.setProviders({
            [ErrorUnknownDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: ErrorUnknownDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
            [ErrorForbiddenDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: ErrorForbiddenDataSource,
                deps: [HttpClient],
            },
            [ErrorNotFoundDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: ErrorNotFoundDataSource,
                deps: [HttpClient],
            },
            [AverageRatingKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AverageRatingKpiDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
        });

        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example (see widgetConfig at the bottom of the file),
        // but this is where the widget's configuration could potentially be populated from a database
        const kpiWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Complete the KPI widget with information coming from its type definition
            [kpiWidget.id]: this.widgetTypesService.mergeWithWidgetType(kpiWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [kpiWidget.id]: {
                cols: 4,
                rows: 6,
                y: 0,
                x: 0,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }

}

const widgetConfig: IWidget = {
    id: "widget1",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                "providers": {
                    [WellKnownProviders.Refresher]: {
                        "properties": {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            "interval": 60 * 10,
                            "enabled": true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            "header": {
                "properties": {
                    "title": "Harry Potter and the Sorcerer's Stone",
                    "subtitle": "By J. K. Rowling",
                },
            },
            "tiles": {
                "properties": {
                    "nodes": ["kpi1"],
                },
            },
            "kpi1": {
                "id": "kpi1",
                "componentType": KpiComponent.lateLoadKey,
                "properties": {
                    "widgetData": {
                        "units": "out of 5 Stars",
                        "label": "Average Rating",
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        "providerId": ErrorUnknownDataSource.providerId,
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
        },
    },
};
