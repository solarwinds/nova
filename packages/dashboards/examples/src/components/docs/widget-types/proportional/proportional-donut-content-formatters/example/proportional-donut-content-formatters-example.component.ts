import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService, IDataField, IDataSource, IFilteringOutputs } from "@nova-ui/bits";
import { IAccessors, IChartAssistSeries } from "@nova-ui/charts";
import {
    DATA_SOURCE,
    DEFAULT_LEGEND_FORMATTERS,
    DEFAULT_PIZZAGNA_ROOT,
    DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS,
    DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS,
    DONUT_CONTENT_CONFIGURATION_SLICE,
    IDashboard,
    IDonutContentConfig,
    IProportionalDataFieldsConfig,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    LegendPlacement,
    PizzagnaLayer,
    ProportionalContentAggregatorsRegistryService,
    ProportionalDonutContentFormattersRegistryService,
    ProportionalLegendFormattersRegistryService,
    ProportionalWidgetChartTypes,
    ProviderRegistryService,
    SiUnitsFormatterComponent,
    sumAggregator,
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
export class BeerReviewCountsByCityMockDataSource extends DataSourceService<IChartAssistSeries<IAccessors>>
    implements IDataSource<IChartAssistSeries<IAccessors>>, OnDestroy {

    public static providerId = "BeerReviewCountsByCityMockDataSource";
    public busy = new BehaviorSubject(false);

    protected dataFields: IDataField[] = [
        {
            id: "Brno",
            label: "Brno",
            // @ts-ignore
            dataType: null,
        },
        {
            id: "kyiv",
            label: "Kyiv",
            // @ts-ignore
            dataType: null,
        },
        {
            id: "austin",
            label: "Austin",
            // @ts-ignore
            dataType: null,
        },
        {
            id: "lisbon",
            label: "Lisbon",
            // @ts-ignore
            dataType: null,
        },
        {
            id: "sydney",
            label: "Sydney",
            // @ts-ignore
            dataType: null,
        },
        {
            id: "nur-sultan",
            label: "Nur-Sultan",
            // @ts-ignore
            dataType: null,
        },
    ];
    protected chartSeriesDataFields: IDataField[] = [
        // default field in the chart series that is used for the aggregation
        {
            id: "data[0]",
            label: "data",
            // @ts-ignore
            dataType: null,
        },
        // any custom field in the chart series that is used for the aggregation
        {
            id: "customDonutContent",
            label: "Custom Donut Content",
            // @ts-ignore
            dataType: null,
        },
    ];

    /**
     * DataSource needs to implement the "IDataFieldsConfig" for this scenario.
     *
     * It's necessary to provide the "chartSeriesDataFields",
     * that's why proportional widget dataSource has it's own interface for that - IProportionalDataFieldsConfig.
     *
     * dataFields$ - stands for possible series fields
     * chartSeriesDataFields$ - stands for the fields IN the series
     *
     * see declaration of "dataFields" and "chartSeriesDataFields" for the example.
     */
    public dataFieldsConfig: IProportionalDataFieldsConfig = {
        dataFields$: new BehaviorSubject<IDataField[]>(this.dataFields),
        chartSeriesDataFields$: new BehaviorSubject<IDataField[]>(this.chartSeriesDataFields),
    };

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.outputsSubject.next({
                    result: getMockBeerReviewCountsByCity(),
                });
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
        // registry for adding the formatter for donut content
        contentFormattersRegistry: ProportionalDonutContentFormattersRegistryService,
        // registry for adding the formatter for proportional legend
        legendFormattersRegistry: ProportionalLegendFormattersRegistryService,
        // registry for adding the aggregators for donut content
        aggregatorRegistry: ProportionalContentAggregatorsRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        // on the dashboard startup, it's necessary to add possible content formatters, legend formatters and content aggregators to the registry.
        // using registry is a way for setting the available formatters.
        legendFormattersRegistry.addItems(DEFAULT_LEGEND_FORMATTERS);
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

        // Setup of the configurator is done here
        this.setupConfigurator();

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

    private initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetIndex: IWidgets = {
            // Complete the proportional widget with information coming from its type definition
            [widgetConfig.id]: this.widgetTypesService.mergeWithWidgetType(widgetConfig),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [widgetConfig.id]: {
                cols: 6,
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

    /**
     * Sets up the configurator sections for proportional donut
     */
    private setupConfigurator() {
        const widgetTemplate = this.widgetTypesService.getWidgetType("proportional", 1);

        // remove old "presentation", "chartOptionsEditor" and "donutContentConfiguration" sections from the configurator
        delete widgetTemplate.configurator?.structure?.presentation;
        delete widgetTemplate.configurator?.structure?.chartOptionsEditor;
        delete widgetTemplate.configurator?.structure?.donutContentConfiguration;

        // add new "presentation" section
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            "presentation",
            DONUT_CONTENT_CONFIGURATION_SLICE.presentation
        );
        // add new "chartOptionsEditor" section
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            "chartOptionsEditor",
            DONUT_CONTENT_CONFIGURATION_SLICE.chartOptionsEditor
        );
        // add new "donutContentConfiguration" section
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            "donutContentConfiguration",
            DONUT_CONTENT_CONFIGURATION_SLICE.donutContentConfiguration
        );
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
                            // old configuration looks like this
                            // contentFormatter: {
                            //     componentType: DonutContentSumFormatterComponent.lateLoadKey,
                            // },

                            // NEW configuration looks like this
                            donutContentConfig: {
                                formatter: {
                                    componentType: SiUnitsFormatterComponent.lateLoadKey,
                                },
                                aggregator: {
                                    aggregatorType: sumAggregator.aggregatorType,
                                    properties: {
                                        // example of a default metric to be used for the percentage calculation
                                        // activeMetricId: "austin",
                                    },
                                },
                            } as IDonutContentConfig,
                        } as IProportionalWidgetChartOptions,
                    } as IProportionalWidgetConfig,
                },
            },
        },
    },
};

export function getMockBeerReviewCountsByCity() {
    return [
        {
            id: "Brno",
            name: "Brno",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_down",
            link: "https://en.wikipedia.org/wiki/Brno",
            value: "Brno",
            customDonutContent: "Custom Brno",
        },
        {
            id: "kyiv",
            name: "Kyiv",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_critical",
            link: "https://en.wikipedia.org/wiki/Kyiv",
            value: "Kyiv",
            customDonutContent: "Custom Kyiv",
        },
        {
            id: "austin",
            name: "Austin",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_warning",
            link: "https://en.wikipedia.org/wiki/Austin",
            value: "Austin",
            customDonutContent: "Custom Austin",
        },
        {
            id: "lisbon",
            name: "Lisbon",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_unknown",
            link: "https://en.wikipedia.org/wiki/Lisbon",
            value: "Lisbon",
            customDonutContent: "Custom Lisbon",
        },
        {
            id: "sydney",
            name: "Sydney",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_up",
            link: "https://en.wikipedia.org/wiki/Sydney",
            value: "Sydney",
            customDonutContent: "Custom Sydney",
        },
        {
            id: "nur-sultan",
            name: "Nur-Sultan",
            data: [Math.round(Math.random() * 1000000)],
            icon: "status_unmanaged",
            link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            value: "Nur-Sultan",
            customDonutContent: "Custom Nur-Sultan",
        },
    ].sort((a, b) => a.data[0] - b.data[0]);

}
