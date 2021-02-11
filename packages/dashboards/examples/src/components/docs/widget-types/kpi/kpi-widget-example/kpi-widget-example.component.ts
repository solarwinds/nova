import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService, IDataField, IFilteringOutputs } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
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

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
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
 * A component that instantiates the dashboard
 */
@Component({
    selector: "kpi-widget-example",
    templateUrl: "./kpi-widget-example.component.html",
    styleUrls: ["./kpi-widget-example.component.less"],
})
export class KpiWidgetExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService
    ) { }

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        // removing broadcaster because of dataFields approach used in the dataSource
        delete widgetTemplate?.configurator?.[PizzagnaLayer.Structure].tiles?.properties?.template[1].providers[WellKnownProviders.Broadcaster];

        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [AverageRatingKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AverageRatingKpiDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
        });

        // Registering our data sources as dropdown options in the widget editor/configurator
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
            [AverageRatingKpiDataSource.providerId]
        );

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
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
    id: "kpiWidgetId",
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
                        "units": `out of 5 Stars`,
                        "label": `Average Rating`,
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
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
        },
    },
};
