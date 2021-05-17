import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService, IDataSource, IFilteringOutputs } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProportionalWidgetData,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    LegendPlacement,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject } from "rxjs";

/**
 * A simple proportional data source to retrieve beer review counts by city
 */
@Injectable()
export class BeerReviewCountsByCityMockDataSource extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "BeerReviewCountsByCityMockDataSource";
    public busy = new BehaviorSubject(false);

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.outputsSubject.next({ result: getMockBeerReviewCountsByCity() });
                this.busy.next(false);
            }, 300);
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
    selector: "proportional-widget-example",
    templateUrl: "./proportional-widget-example.component.html",
    styleUrls: ["./proportional-widget-example.component.less"],
})
export class ProportionalWidgetExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,
        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef

    ) {
    }

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType("proportional", 1);

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
            [BeerReviewCountsByCityMockDataSource.providerId]
        );

        // Registering the data source for injection into the Proportional widget.
        this.providerRegistry.setProviders({
            [BeerReviewCountsByCityMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerReviewCountsByCityMockDataSource,
                deps: [],
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
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetIndex: IWidgets = {
            // Complete the proportional widget with information coming from its type definition
            [widgetConfig.id]: this.widgetTypesService.mergeWithWidgetType(widgetConfig),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [widgetConfig.id]: {
                cols: 5,
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
    id: "proportionalWidgetId",
    type: "proportional",
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
                    "title": "Beer Review Tally by City",
                    "subtitle": "These People Love Beer",
                },
            },
            "chart": {
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the chart
                        "providerId": BeerReviewCountsByCityMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
                "properties": {
                    "configuration": {
                        "chartOptions": {
                            "type": ProportionalWidgetChartTypes.DonutChart,
                            "legendPlacement": LegendPlacement.Right,
                        } as IProportionalWidgetChartOptions,
                        // You can optionally define custom colors for the chart by setting the 'chartColors' configuration property
                        // "chartColors": [
                        //     "var(--nui-color-chart-five)",
                        //     "var(--nui-color-chart-six)",
                        //     "var(--nui-color-chart-seven)",
                        //     "var(--nui-color-chart-eight)",
                        //     "var(--nui-color-chart-nine)",
                        //     "var(--nui-color-chart-ten)",
                        // ],
                        // or use-mapped structure
                        chartColors: {
                            "Brno": "var(--nui-color-chart-five)",
                            "kyiv": "var(--nui-color-chart-six)",
                            "austin": "var(--nui-color-chart-seven)",
                            "lisbon": "var(--nui-color-chart-eight)",
                            "sydney": "var(--nui-color-chart-nine)",
                            "nur-sultan": "var(--nui-color-chart-ten)",
                        },
                        prioritizeWidgetColors: false,
                    } as IProportionalWidgetConfig,
                },
            },
        },
    },
};

// export interface IProportionalWidgetData {
//     id: string;
//     name: string;
//     data: number[];
//     link: string;
//     value: string;
// }

export function getMockBeerReviewCountsByCity() {
    return [
        {
            id: "Brno",
            name: "Brno",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_down",
            link: "https://en.wikipedia.org/wiki/Brno",
            value: "Brno",
            color: "var(--nui-color-chart-one)",
        },
        {
            id: "kyiv",
            name: "Kyiv",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_critical",
            link: "https://en.wikipedia.org/wiki/Kyiv",
            value: "Kyiv",
            color: "var(--nui-color-chart-two)",
        },
        {
            id: "austin",
            name: "Austin",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_warning",
            link: "https://en.wikipedia.org/wiki/Austin",
            value: "Austin",
            color: "var(--nui-color-chart-three)",
        },
        {
            id: "lisbon",
            name: "Lisbon",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_unknown",
            link: "https://en.wikipedia.org/wiki/Lisbon",
            value: "Lisbon",
            color: "var(--nui-color-chart-four)",
        },
        {
            id: "sydney",
            name: "Sydney",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_up",
            link: "https://en.wikipedia.org/wiki/Sydney",
            value: "Sydney",
            color: "var(--nui-color-chart-five)",
        },
        {
            id: "nur-sultan",
            name: "Nur-Sultan",
            data: [Math.round(Math.random() * 100000)],
            icon: "status_unmanaged",
            link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            value: "Nur-Sultan",
            color: "var(--nui-color-chart-six)",
        },
    ].sort((a, b) => a.data[0] - b.data[0]);
}
