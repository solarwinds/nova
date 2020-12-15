import { Component, Injectable, OnInit } from "@angular/core";
import { DataSourceService, IDataSourceOutput, INovaFilters, ITimeframe } from "@nova-ui/bits";
import { CHART_PALETTE_CS_S } from "@nova-ui/charts";
import {
    applyStatusEndpoints,
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IDataSource,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesItemConfiguration,
    ITimeseriesOutput,
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    ITimeseriesWidgetStatusData,
    IWidget,
    LegendPlacement,
    PizzagnaLayer,
    ProviderRegistryService,
    TimeseriesChartPreset,
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
export class TimeseriesStatusDataSource extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
    public static providerId = "TimeseriesStatusDataSource";

    public busy = new BehaviorSubject(false);

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITimeseriesOutput<ITimeseriesWidgetStatusData>>> {
        // In this example we're using some static mock data located at the bottom of this file. In a real-world
        // scenario, the data for the chart would likely be retrieved via an asynchronous backend call.
        const data = getData();
        let filteredData = data;

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

            // apply endpoints on the filtered status data so that when the status chart is zoomed (filtered),
            // each status visualizations is ensured to have valid start and end values
            filteredData = applyStatusEndpoints(timeframeFilter, filteredData, data);
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
    selector: "timeseries-widget-status-bar-example",
    templateUrl: "./timeseries-widget-status-bar-example.component.html",
    styleUrls: ["./timeseries-widget-status-bar-example.component.less"],
})
export class TimeseriesWidgetStatusBarExampleComponent implements OnInit {
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
            [TimeseriesStatusDataSource.providerId]
        );

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [TimeseriesStatusDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TimeseriesStatusDataSource,
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
        id: "statusChartWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            "providerId": TimeseriesStatusDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Status Bar Chart",
                        "subtitle": "Basic Timeseries Widget",
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
                                        label: "Node Status",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Node Status",
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
                            // Setting the preset to status bar
                            preset: TimeseriesChartPreset.StatusBar,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        // Setting the initial timeframe selected in the timeframe bar
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
];

export const startOfToday = () => moment().startOf("day");

export const getData = (): ITimeseriesWidgetData<ITimeseriesWidgetStatusData>[] => {
    const series: ITimeseriesWidgetData<any>[] = [
        {
            id: "series-1",
            name: "Node Status",
            description: "lastchance.demo.lab",
            data: [
                // the 'x' value is set to the time and 'y' to the status at that given time
                { x: startOfToday().subtract(20, "day").toDate(), y: Status.Warning },
                { x: startOfToday().subtract(19, "day").toDate(), y: Status.Down },
                { x: startOfToday().subtract(17, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(16, "day").toDate(), y: Status.Warning },
                { x: startOfToday().subtract(15, "day").toDate(), y: Status.Down },
                { x: startOfToday().subtract(14, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(12, "day").toDate(), y: Status.Unknown },
                { x: startOfToday().subtract(10, "day").toDate(), y: Status.Up },
                { x: startOfToday().subtract(9, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(6, "day").toDate(), y: Status.Up },
                { x: startOfToday().subtract(3, "day").toDate(), y: Status.Warning },
                { x: startOfToday().subtract(2, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(1, "day").toDate(), y: Status.Up },
                // This data point will be ignored and is only here to provide an endpoint for the previous status.
                { x: moment().toDate(), y: Status.Up },
            ],
        },
        {
            id: "series-2",
            name: "Node Status",
            description: "newhope.demo.lab",
            data: [
                { x: startOfToday().subtract(19, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(18, "day").toDate(), y: Status.Unknown },
                { x: startOfToday().subtract(17, "day").toDate(), y: Status.Warning },
                { x: startOfToday().subtract(15, "day").toDate(), y: Status.Down },
                { x: startOfToday().subtract(8, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(7, "day").toDate(), y: Status.Down },
                { x: startOfToday().subtract(6, "day").toDate(), y: Status.Up },
                { x: startOfToday().subtract(5, "day").toDate(), y: Status.Critical },
                { x: startOfToday().subtract(4, "day").toDate(), y: Status.Up },
                { x: startOfToday().subtract(3, "day").toDate(), y: Status.Warning },
                { x: startOfToday().subtract(2, "day").toDate(), y: Status.Up },
                { x: startOfToday().subtract(1, "day").toDate(), y: Status.Down },
                // This data point will be ignored and is only here to provide an endpoint for the previous status.
                { x: moment().toDate(), y: Status.Down },
            ],
        },
    ];

    for (const s of series) {
        // here are we setting the color and icon associated to the status for each data point
        s.data = s.data.map((d: any, i: number) => ({
            ...d,
            color: statusColors[d.y as Status],
            // The thickness of the line is dependant on the status. If the status equals 'Up' then 'thick' is set to false.
            thick: d.y !== Status.Up,
            icon: "status_" + d.y,
        }));
    }

    return series;
};

// An enumeration of statuses
enum Status {
    Unknown = "unknown",
    Up = "up",
    Warning = "warning",
    Down = "down",
    Critical = "critical",
}

// This is the map used for setting the color of each status bar
const statusColors: Record<Status, string> = {
    [Status.Unknown]: CHART_PALETTE_CS_S[3],
    [Status.Up]: CHART_PALETTE_CS_S[4],
    [Status.Warning]: CHART_PALETTE_CS_S[2],
    [Status.Down]: CHART_PALETTE_CS_S[0],
    [Status.Critical]: CHART_PALETTE_CS_S[1],
};

// Setting the widget dimensions and position (this is for gridster)
const positions: Record<string, GridsterItem> = {
    [widgetConfigs[0].id]: {
        cols: 12,
        rows: 4,
        y: 0,
        x: 0,
    },
};
