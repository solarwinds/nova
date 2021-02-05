import { Component, Injectable, OnInit } from "@angular/core";
import { DataSourceService, IDataSource, INovaFilters, ITimeframe } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IDataSourceOutput,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesItemConfiguration,
    ITimeseriesOutput,
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    IWidget,
    LegendPlacement,
    PizzagnaLayer,
    ProviderRegistryService,
    TimeseriesChartPreset,
    TimeseriesScaleType,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import keyBy from "lodash/keyBy";
import moment, { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

/**
 * A simple Timeseries data source implementation
 */
@Injectable()
export class BeerVsReadingMockDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "BeerVsReadingMockDataSource";

    public busy = new BehaviorSubject<boolean>(false);

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITimeseriesOutput>> {
        // In this example we're using some static mock data located at the bottom of this file. In a real-world
        // scenario, the data for the chart would likely be retrieved via an asynchronous backend call.
        let filteredData = getData();

        this.busy.next(true);

        // Filtering using the filter registered by the TimeFrameBar
        const timeframeFilter = filters.timeframe?.value as ITimeframe;
        if (timeframeFilter) {
            filteredData = filteredData.map((item: ITimeseriesWidgetData) =>
                ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    data: item.data.filter((seriesData: ITimeseriesWidgetSeriesData) =>
                        filterDates(seriesData.x, timeframeFilter.startDatetime, timeframeFilter.endDatetime)),
                }));
        }

        this.busy.next(false);

        return { result: { series: filteredData } };
    }
}

function filterDates(dateToCheck: Date, startDate: Moment, endDate: Moment) {
    const mom = moment(dateToCheck);
    return mom.isBetween(startDate, endDate) || mom.isSame(startDate) || mom.isSame(endDate);
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "timeseries-widget-example",
    templateUrl: "./timeseries-widget-example.component.html",
    styleUrls: ["./timeseries-widget-example.component.less"],
})
export class TimeseriesWidgetExampleComponent implements OnInit {
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
        const widgetTemplate = this.widgetTypesService.getWidgetType("timeseries", 1);
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
            [BeerVsReadingMockDataSource.providerId]
        );

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [BeerVsReadingMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerVsReadingMockDataSource,
                deps: [],
            },
        });

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetsWithStructure = widgetConfigs.map(w => this.widgetTypesService.mergeWithWidgetType(w));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);


        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions,
            widgets: widgetsIndex,
        };
    }

}

const widgetConfigs: IWidget[] = [
    {
        id: "lineWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            "providerId": BeerVsReadingMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Line Chart",
                        "subtitle": "Survey of 1000 Solarians",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                // Setting the series and corresponding labels to initially display on the chart
                                "series": [
                                    {
                                        id: "series-1",
                                        label: "Beer Tasting",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Reading",
                                        selectedSeriesId: "series-2",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        // Setting the general chart configuration
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Solarians (%)",
                            // You can optionally define custom colors for the chart by setting the 'chartColors' configuration property
                            // "chartColors": [
                            //     "var(--nui-color-chart-eight)",
                            //     "var(--nui-color-chart-nine)",
                            //     "var(--nui-color-chart-ten)",
                            // ],
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        // Setting the initial timeframe selected in the timeframe bar
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "minDate": moment().subtract(60, "days").format(),
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
    {
        id: "stackedAreaWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            "providerId": BeerVsReadingMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Stacked Area Chart",
                        "subtitle": "Survey of 1000 Solarians",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                // Setting the series and corresponding labels to initially display on the chart
                                "series": [
                                    {
                                        id: "series-1",
                                        label: "Beer Tasting",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Reading",
                                        selectedSeriesId: "series-2",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        // Setting the general chart configuration
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            // Setting the preset to stacked area
                            preset: TimeseriesChartPreset.StackedArea,
                            "leftAxisLabel": "Solarians (%)",
                            // You can optionally define custom colors for the chart by setting the 'chartColors' configuration property
                            // "chartColors": [
                            //     "var(--nui-color-chart-eight)",
                            //     "var(--nui-color-chart-nine)",
                            //     "var(--nui-color-chart-ten)",
                            // ],
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        // Setting the initial timeframe selected in the timeframe bar
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "minDate": moment().subtract(60, "days").format(),
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
    {
        id: "stackedPercentageAreaWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            "providerId": BeerVsReadingMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Stacked Percentage Area Chart",
                        "subtitle": "Survey of 1000 Solarians",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                // Setting the series and corresponding labels to initially display on the chart
                                "series": [
                                    {
                                        id: "series-1",
                                        label: "Beer Tasting",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Reading",
                                        selectedSeriesId: "series-2",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        // Setting the general chart configuration
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            // Setting the preset to stacked percentage area
                            preset: TimeseriesChartPreset.StackedPercentageArea,
                            "leftAxisLabel": "Solarians (%)",
                            // You can optionally define custom colors for the chart by setting the 'chartColors' configuration property
                            // "chartColors": [
                            //     "var(--nui-color-chart-eight)",
                            //     "var(--nui-color-chart-nine)",
                            //     "var(--nui-color-chart-ten)",
                            // ],
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        // Setting the initial timeframe selected in the timeframe bar
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "minDate": moment().subtract(60, "days").format(),
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
    {
        id: "stackedBarWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            "providerId": BeerVsReadingMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Stacked Bar Chart",
                        "subtitle": "Survey of 1000 Solarians",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                // Setting the series and corresponding labels to initially display on the chart
                                "series": [
                                    {
                                        id: "series-1",
                                        label: "Beer Tasting",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Reading",
                                        selectedSeriesId: "series-2",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Solarians (%)",
                            // Setting the preset to stacked bar
                            preset: TimeseriesChartPreset.StackedBar,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        // Setting the initial timeframe selected in the timeframe bar
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "minDate": moment().subtract(60, "days").format(),
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
];

// using startOf("day") so that each band for the bar chart corresponds to a calendar day
const now = moment().startOf("day");

export const getData = (): ITimeseriesWidgetData[] =>
    [
        {
            id: "series-1",
            name: "Beer Tasting",
            description: "Havin' some suds",
            data: [
                { x: now.clone().subtract(20, "day").toDate(), y: 30 },
                { x: now.clone().subtract(19, "day").toDate(), y: 35 },
                { x: now.clone().subtract(18, "day").toDate(), y: 33 },
                { x: now.clone().subtract(17, "day").toDate(), y: 40 },
                { x: now.clone().subtract(16, "day").toDate(), y: 35 },
                { x: now.clone().subtract(15, "day").toDate(), y: 30 },
                { x: now.clone().subtract(14, "day").toDate(), y: 35 },
                { x: now.clone().subtract(13, "day").toDate(), y: 15 },
                { x: now.clone().subtract(12, "day").toDate(), y: 30 },
                { x: now.clone().subtract(11, "day").toDate(), y: 45 },
                { x: now.clone().subtract(10, "day").toDate(), y: 60 },
                { x: now.clone().subtract(9, "day").toDate(), y: 54 },
                { x: now.clone().subtract(8, "day").toDate(), y: 42 },
                { x: now.clone().subtract(7, "day").toDate(), y: 44 },
                { x: now.clone().subtract(6, "day").toDate(), y: 54 },
                { x: now.clone().subtract(5, "day").toDate(), y: 43 },
                { x: now.clone().subtract(4, "day").toDate(), y: 76 },
                { x: now.clone().subtract(3, "day").toDate(), y: 54 },
                { x: now.clone().subtract(2, "day").toDate(), y: 42 },
                { x: now.clone().subtract(1, "day").toDate(), y: 34 },
            ],
        },
        {
            id: "series-2",
            name: "Reading",
            description: "Hittin' the books",
            data: [
                { x: now.clone().subtract(20, "day").toDate(), y: 60 },
                { x: now.clone().subtract(19, "day").toDate(), y: 64 },
                { x: now.clone().subtract(18, "day").toDate(), y: 70 },
                { x: now.clone().subtract(17, "day").toDate(), y: 55 },
                { x: now.clone().subtract(16, "day").toDate(), y: 55 },
                { x: now.clone().subtract(15, "day").toDate(), y: 45 },
                { x: now.clone().subtract(14, "day").toDate(), y: 60 },
                { x: now.clone().subtract(13, "day").toDate(), y: 65 },
                { x: now.clone().subtract(12, "day").toDate(), y: 63 },
                { x: now.clone().subtract(11, "day").toDate(), y: 60 },
                { x: now.clone().subtract(10, "day").toDate(), y: 61 },
                { x: now.clone().subtract(9, "day").toDate(), y: 65 },
                { x: now.clone().subtract(8, "day").toDate(), y: 63 },
                { x: now.clone().subtract(7, "day").toDate(), y: 58 },
                { x: now.clone().subtract(6, "day").toDate(), y: 64 },
                { x: now.clone().subtract(5, "day").toDate(), y: 63 },
                { x: now.clone().subtract(4, "day").toDate(), y: 60 },
                { x: now.clone().subtract(3, "day").toDate(), y: 62 },
                { x: now.clone().subtract(2, "day").toDate(), y: 61 },
                { x: now.clone().subtract(1, "day").toDate(), y: 62 },
            ],
        },
    ];

// Setting the widget dimensions and position (this is for gridster)
const positions: Record<string, GridsterItem> = {
    [widgetConfigs[0].id]: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 0,
    },
    [widgetConfigs[1].id]: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 6,
    },
    [widgetConfigs[3].id]: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 0,
    },
    [widgetConfigs[2].id]: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 6,
    },
};
