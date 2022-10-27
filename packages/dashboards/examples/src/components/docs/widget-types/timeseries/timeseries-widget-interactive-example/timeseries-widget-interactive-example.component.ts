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

import {
    ChangeDetectorRef,
    Component,
    Injectable,
    OnInit,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import cloneDeep from "lodash/cloneDeep";
import keyBy from "lodash/keyBy";
import moment, { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

import {
    DataSourceService,
    IDataSource,
    INovaFilters,
    ITimeframe,
} from "@nova-ui/bits";
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
    NOVA_URL_INTERACTION_HANDLER,
    LegendPlacement,
    PizzagnaLayer,
    ProviderRegistryService,
    TimeseriesChartPreset,
    TimeseriesScaleType,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

/**
 * A simple Timeseries data source implementation
 */
@Injectable()
export class TimeseriesMockDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "TimeseriesMockDataSource";

    public busy = new BehaviorSubject<boolean>(false);

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<IDataSourceOutput<ITimeseriesOutput>> {
        // In this example we're using some static mock data located at the bottom of this file. In a real-world
        // scenario, the data for the chart would likely be retrieved via an asynchronous backend call.
        let filteredData = getData();

        this.busy.next(true);

        // Filtering using the filter registered by the TimeFrameBar
        const timeframeFilter = filters.timeframe?.value as ITimeframe;
        if (timeframeFilter) {
            filteredData = filteredData.map((item: ITimeseriesWidgetData) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                // the filtered data should return the provided links if they are set.
                link: item?.link,
                secondaryLink: item?.secondaryLink,
                data: item.data.filter(
                    (seriesData: ITimeseriesWidgetSeriesData) =>
                        filterDates(
                            seriesData.x,
                            timeframeFilter.startDatetime,
                            timeframeFilter.endDatetime
                        )
                ),
            }));
        }

        this.busy.next(false);

        return { result: { series: filteredData } };
    }
}

function filterDates(dateToCheck: Date, startDate: Moment, endDate: Moment) {
    const mom = moment(dateToCheck);
    return (
        mom.isBetween(startDate, endDate) ||
        mom.isSame(startDate) ||
        mom.isSame(endDate)
    );
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "timeseries-widget-interactive-example",
    templateUrl: "./timeseries-widget-interactive-example.component.html",
    styleUrls: ["./timeseries-widget-interactive-example.component.less"],
})
export class TimeseriesWidgetInteractiveExampleComponent implements OnInit {
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

        // Angular's ChangeDetectorRef
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "timeseries",
            1
        );
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
            [TimeseriesMockDataSource.providerId]
        );

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [TimeseriesMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TimeseriesMockDataSource,
                deps: [],
            },
        });

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetsWithStructure = widgetConfigs.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions: cloneDeep(positions),
            widgets: widgetsIndex,
        };
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }
}

const widgetConfigs: IWidget[] = [
    {
        id: "lineWidgetId",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            providerId: TimeseriesMockDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.InteractionHandler]: {
                            // Setting the UrlInteractionHandler as an interactionHandler
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                // the 'url' property tells the handler what link to use when interaction occurs on the series
                                url: "${data.link || 'https://en.wikipedia.org/wiki/'+data.legendDescriptionPrimary}",
                                // by default the link is opened in the current window, set 'newWindow' to true to open in a new tab instead
                                // newWindow: true,
                            },
                        },
                    },
                },
                header: {
                    properties: {
                        title: "Line Chart",
                        subtitle: "Basic Timeseries with Interaction",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                // Setting the series and corresponding labels to initially display on the chart
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Nur-Sultan",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Brno",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Lisbon",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Austin",
                                        selectedSeriesId: "series-4",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    properties: {
                        // Setting the general chart configuration
                        configuration: {
                            // setting interaction to 'series' will make all series in the chart interactable
                            interaction: "series",
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        minDate: moment().subtract(60, "days").format(),
                        maxDate: moment().format(),
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
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            // Setting the initially selected data source providerId
                            providerId: TimeseriesMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Stacked Bar Chart",
                        subtitle:
                            "Basic Timeseries without Interaction Handler",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                // Setting the series and corresponding labels to initially display on the chart
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Nur-Sultan",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Brno",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Lisbon",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Austin",
                                        selectedSeriesId: "series-4",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    properties: {
                        // Setting the general chart configuration
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
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
                timeframeSelection: {
                    properties: {
                        // Setting the initial timeframe selected in the timeframe bar
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        minDate: moment().subtract(60, "days").format(),
                        maxDate: moment().format(),
                    },
                },
            },
        },
    },
];

// using startOf("day") so that each band for the bar chart corresponds to a calendar day
const startOfToday = moment().startOf("day").toDate();

export const getData = (): ITimeseriesWidgetData[] => [
    {
        id: "series-1",
        name: "Nur-Sultan",
        description: "'link' only",
        link: "https://en.wikipedia.org/wiki/Nur-Sultan",
        data: [
            { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(19, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(18, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(17, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(16, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(15, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(14, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(13, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(12, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(11, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(10, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(9, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(8, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(7, "day").toDate(), y: 36 },
            { x: moment(startOfToday).subtract(6, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(5, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(4, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(3, "day").toDate(), y: 32 },
            { x: moment(startOfToday).subtract(2, "day").toDate(), y: 31 },
            { x: moment(startOfToday).subtract(1, "day").toDate(), y: 34 },
            { x: moment(startOfToday).toDate(), y: 25 },
        ],
    },
    {
        id: "series-2",
        name: "Brno",
        description: "'link' and 'secondaryLink'",
        link: "https://en.wikipedia.org/wiki/Brno",
        secondaryLink: "https://en.wikipedia.org/wiki/Europe",
        data: [
            { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(19, "day").toDate(), y: 64 },
            { x: moment(startOfToday).subtract(18, "day").toDate(), y: 70 },
            { x: moment(startOfToday).subtract(17, "day").toDate(), y: 55 },
            { x: moment(startOfToday).subtract(16, "day").toDate(), y: 55 },
            { x: moment(startOfToday).subtract(15, "day").toDate(), y: 45 },
            { x: moment(startOfToday).subtract(14, "day").toDate(), y: 10 },
            { x: moment(startOfToday).subtract(13, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(12, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(11, "day").toDate(), y: 60 },
            { x: moment(startOfToday).subtract(10, "day").toDate(), y: 61 },
            { x: moment(startOfToday).subtract(9, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(8, "day").toDate(), y: 63 },
            { x: moment(startOfToday).subtract(7, "day").toDate(), y: 58 },
            { x: moment(startOfToday).subtract(6, "day").toDate(), y: 64 },
            { x: moment(startOfToday).subtract(5, "day").toDate(), y: 63 },
            { x: moment(startOfToday).subtract(4, "day").toDate(), y: 60 },
            { x: moment(startOfToday).subtract(3, "day").toDate(), y: 62 },
            { x: moment(startOfToday).subtract(2, "day").toDate(), y: 61 },
            { x: moment(startOfToday).subtract(1, "day").toDate(), y: 62 },
            { x: moment(startOfToday).toDate(), y: 55 },
        ],
    },
    {
        id: "series-3",
        name: "Lisbon",
        description: "'secondaryLink' only",
        secondaryLink: "https://en.wikipedia.org/wiki/Lisbon",
        data: [
            { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(19, "day").toDate(), y: 80 },
            { x: moment(startOfToday).subtract(18, "day").toDate(), y: 70 },
            { x: moment(startOfToday).subtract(17, "day").toDate(), y: 95 },
            { x: moment(startOfToday).subtract(16, "day").toDate(), y: 90 },
            { x: moment(startOfToday).subtract(15, "day").toDate(), y: 85 },
            { x: moment(startOfToday).subtract(14, "day").toDate(), y: 70 },
            { x: moment(startOfToday).subtract(13, "day").toDate(), y: 75 },
            { x: moment(startOfToday).subtract(12, "day").toDate(), y: 69 },
            { x: moment(startOfToday).subtract(11, "day").toDate(), y: 75 },
            { x: moment(startOfToday).subtract(10, "day").toDate(), y: 81 },
            { x: moment(startOfToday).subtract(9, "day").toDate(), y: 93 },
            { x: moment(startOfToday).subtract(8, "day").toDate(), y: 83 },
            { x: moment(startOfToday).subtract(7, "day").toDate(), y: 70 },
            { x: moment(startOfToday).subtract(6, "day").toDate(), y: 74 },
            { x: moment(startOfToday).subtract(5, "day").toDate(), y: 73 },
            { x: moment(startOfToday).subtract(4, "day").toDate(), y: 68 },
            { x: moment(startOfToday).subtract(3, "day").toDate(), y: 72 },
            { x: moment(startOfToday).subtract(2, "day").toDate(), y: 61 },
            { x: moment(startOfToday).subtract(1, "day").toDate(), y: 69 },
            { x: moment(startOfToday).toDate(), y: 60 },
        ],
    },
    {
        id: "series-4",
        name: "Austin",
        description: "No links",
        data: [
            { x: moment(startOfToday).subtract(59, "day").toDate(), y: 25 },
            { x: moment(startOfToday).subtract(58, "day").toDate(), y: 43 },
            { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(56, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(54, "day").toDate(), y: 25 },
            { x: moment(startOfToday).subtract(53, "day").toDate(), y: 45 },
            { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(51, "day").toDate(), y: 85 },
            { x: moment(startOfToday).subtract(50, "day").toDate(), y: 74 },
            { x: moment(startOfToday).subtract(49, "day").toDate(), y: 55 },
            { x: moment(startOfToday).subtract(48, "day").toDate(), y: 23 },
            { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(46, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(45, "day").toDate(), y: 20 },
            { x: moment(startOfToday).subtract(44, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(43, "day").toDate(), y: 25 },
            { x: moment(startOfToday).subtract(42, "day").toDate(), y: 40 },
            { x: moment(startOfToday).subtract(41, "day").toDate(), y: 25 },
            { x: moment(startOfToday).subtract(40, "day").toDate(), y: 54 },
            { x: moment(startOfToday).subtract(39, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
            { x: moment(startOfToday).subtract(37, "day").toDate(), y: 50 },
            { x: moment(startOfToday).subtract(36, "day").toDate(), y: 45 },
            { x: moment(startOfToday).subtract(35, "day").toDate(), y: 20 },
            { x: moment(startOfToday).subtract(34, "day").toDate(), y: 25 },
            { x: moment(startOfToday).subtract(33, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(32, "day").toDate(), y: 20 },
            { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(30, "day").toDate(), y: 14 },
            { x: moment(startOfToday).subtract(29, "day").toDate(), y: 55 },
            { x: moment(startOfToday).subtract(28, "day").toDate(), y: 23 },
            { x: moment(startOfToday).subtract(27, "day").toDate(), y: 10 },
            { x: moment(startOfToday).subtract(26, "day").toDate(), y: 5 },
            { x: moment(startOfToday).subtract(25, "day").toDate(), y: 20 },
            { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
            { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
            { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
            { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
            { x: moment(startOfToday).subtract(19, "day").toDate(), y: 50 },
            { x: moment(startOfToday).subtract(18, "day").toDate(), y: 60 },
            { x: moment(startOfToday).subtract(17, "day").toDate(), y: 95 },
            { x: moment(startOfToday).subtract(16, "day").toDate(), y: 80 },
            { x: moment(startOfToday).subtract(15, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(14, "day").toDate(), y: 80 },
            { x: moment(startOfToday).subtract(13, "day").toDate(), y: 85 },
            { x: moment(startOfToday).subtract(12, "day").toDate(), y: 69 },
            { x: moment(startOfToday).subtract(11, "day").toDate(), y: 65 },
            { x: moment(startOfToday).subtract(10, "day").toDate(), y: 71 },
            { x: moment(startOfToday).subtract(9, "day").toDate(), y: 73 },
            { x: moment(startOfToday).subtract(8, "day").toDate(), y: 43 },
            { x: moment(startOfToday).subtract(7, "day").toDate(), y: 70 },
            { x: moment(startOfToday).subtract(6, "day").toDate(), y: 84 },
            { x: moment(startOfToday).subtract(5, "day").toDate(), y: 73 },
            { x: moment(startOfToday).subtract(4, "day").toDate(), y: 38 },
            { x: moment(startOfToday).subtract(3, "day").toDate(), y: 72 },
            { x: moment(startOfToday).subtract(2, "day").toDate(), y: 81 },
            { x: moment(startOfToday).subtract(1, "day").toDate(), y: 59 },
            { x: moment(startOfToday).toDate(), y: 60 },
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
};
