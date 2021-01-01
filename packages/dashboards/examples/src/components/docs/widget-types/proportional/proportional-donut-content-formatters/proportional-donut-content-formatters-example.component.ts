import { Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS,
    DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS,
    DonutContentSumFormatterComponent,
    IDashboard,
    IDataSource,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    LegendPlacement,
    percentageAggregator,
    PercentageFormatterComponent,
    PizzagnaLayer,
    ProportionalContentAggregatorsRegistryService,
    ProportionalDonutContentFormattersRegistryService,
    ProportionalWidgetChartTypes,
    ProviderRegistryService,
    SiUnitsFormatterComponent,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { IFilteringOutputs } from "@nova-ui/bits/services/data-source/public-api";
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
    selector: "proportional-widget-donut-content-formatters-example",
    templateUrl: "./proportional-donut-content-formatters-example.component.html",
    styleUrls: ["./proportional-donut-content-formatters-example.component.less"],
})
export class ProportionalWidgetDonutContentFormattersExampleComponent implements OnInit {
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
        private providerRegistry: ProviderRegistryService,
        contentFormattersRegistry: ProportionalDonutContentFormattersRegistryService,
        aggregatorRegistry: ProportionalContentAggregatorsRegistryService
    ) {
        contentFormattersRegistry.addItems(DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS);
        aggregatorRegistry.addItems(DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS);
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
                "providers": { },
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
                            contentFormatter: {
                                componentType: DonutContentSumFormatterComponent.lateLoadKey,
                            },
                            donutContentConfig: {
                                formatter: {
                                    componentType: PercentageFormatterComponent.lateLoadKey,
                                },
                                aggregator: {
                                    aggregatorType: percentageAggregator.aggregatorType,
                                    properties: {
                                        activeMetricId: "austin",
                                    },
                                },
                            },
                        } as IProportionalWidgetChartOptions,
                    } as IProportionalWidgetConfig,
                },
            },
        },
    },
};

export interface IProportionalWidgetData {
    id: string;
    name: string;
    data: number[];
    link: string;
    value: string;
}

export function getMockBeerReviewCountsByCity() {
    return [
        {
            id: "Brno",
            name: "Brno",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Brno",
            value: "Brno",
        },
        {
            id: "kyiv",
            name: "Kyiv",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Kyiv",
            value: "Kyiv",
        },
        {
            id: "austin",
            name: "Austin",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Austin",
            value: "Austin",
        },
        {
            id: "lisbon",
            name: "Lisbon",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Lisbon",
            value: "Lisbon",
        },
        {
            id: "sydney",
            name: "Sydney",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Sydney",
            value: "Sydney",
        },
        {
            id: "nur-sultan",
            name: "Nur-Sultan",
            data: [Math.round(Math.random() * 100000)],
            link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            value: "Nur-Sultan",
        },
    ].sort((a, b) => a.data[0] - b.data[0]);
}
