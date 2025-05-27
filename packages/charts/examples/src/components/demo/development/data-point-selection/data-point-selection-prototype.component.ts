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

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import moment, { duration } from "moment/moment";

import {
    BandScale,
    barAccessors,
    BarGridConfig,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    BarStatusGridConfig,
    BorderConfig,
    Chart,
    CHART_PALETTE_CS1,
    CHART_PALETTE_CS_S_EXTENDED,
    convert,
    DataAccessor,
    DATA_POINT_NOT_FOUND,
    IAccessors,
    IBarRendererConfig,
    IChartEvent,
    IDataPoint,
    IDataSeries,
    IInteractionDataPointsEvent,
    IInteractionValues,
    IInteractionValuesPayload,
    InteractionLabelPlugin,
    InteractionLinePlugin,
    InteractionType,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_VALUES_EVENT,
    IXYScales,
    MappedValueProvider,
    MOUSE_ACTIVE_EVENT,
    SelectedDatPointIdxFn,
    StatusAccessors,
    statusAccessors,
    TimeIntervalScale,
    UtilityService,
    XYGrid,
} from "@nova-ui/charts";

const format = "YYYY-MM-DDTHH:mm:ssZ";
const baseDate = "2016-12-25T15:05:00Z";

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
}

@Component({
    templateUrl: "./data-point-selection-prototype.component.html",
    styleUrls: ["./data-point-selection-prototype.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class DataPointSelectionPrototypeComponent implements OnInit {
    public barChart: Chart;
    public statusChart: Chart;

    // Use the same 'x' scale id for both charts to ensure that interaction events such as hover are shared between the charts
    private xScaleId = "xScale";

    private selectedDataPoints: Record<string, IDataPoint> = {};
    private labelPlugin = new InteractionLabelPlugin();
    private renderer: BarRenderer;
    private selectedLabelPosition?: IInteractionValues;

    private colorProvider = {
        // sets the bars used to visualize the selection box to 'transparent'. All other bars just use the first color in the CS1 palette.
        get: (seriesId: string) =>
            seriesId === "selection-box" ? "transparent" : CHART_PALETTE_CS1[0],
        reset: () => {},
    };

    public ngOnInit(): void {
        this.setUpBarChart();
        this.setUpStatusChart();
    }

    public onReset(): void {
        // Reset the stored selection
        this.selectedDataPoints = {};
        this.selectedLabelPosition = undefined;

        // Redraw the charts
        this.redrawCharts();

        // Re-enable interaction label updates and hide the label by emitting a mouse move 'INTERACTION_VALUES_EVENT' with empty values.
        this.labelPlugin.areLabelUpdatesEnabled = true;
        this.barChart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .next({
                data: {
                    interactionType: InteractionType.MouseMove,
                    values: {},
                },
            });
    }

    private setUpBarChart() {
        this.barChart = new Chart(this.configureBarGrid());
        this.barChart.addPlugin(new InteractionLinePlugin());
        this.barChart.addPlugin(this.labelPlugin);

        // Setting up data point click handling
        this.barChart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .subscribe(this.handleDataPointsInteraction);
        // Setting up interaction label update handling
        this.barChart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .subscribe(this.handleInteractionLabelUpdates);
        // Setting up what happens on chart mouseenter and mouseleave
        this.barChart
            .getEventBus()
            .getStream(MOUSE_ACTIVE_EVENT)
            .subscribe(this.handleMouseActive);

        // The color provider sets the selection boxes to 'transparent'
        const accessors = barAccessors({}, this.colorProvider);
        // The 'cssClassAccessor' updates the stroke color of the selection box when a time interval is selected
        accessors.data.cssClass = this.cssClassAccessor;

        const scales = barScales();
        // Use the same 'x' scale id as the status chart to ensure that interaction events such as hover are shared between the charts
        scales.x = new TimeIntervalScale(duration(5, "minutes"), this.xScaleId);

        // The 'barThickness' method sets the selection box width to be larger than the standard bars
        accessors.data.thickness = this.barThickness(scales);

        const rendererConfig: IBarRendererConfig = {
            // Supply a 'selectedDataPointIdxFn' to the 'BarHighlightStrategy' to prevent the selected bar
            // from being deemphasized/grayed out as the chart is hovered.
            highlightStrategy: new BarHighlightStrategy(
                "x",
                1,
                this.selectedDataPointIdxFn
            ),
            cursor: "pointer",
        };
        this.renderer = new BarRenderer(rendererConfig);

        // Initialize the bar chart
        this.barChart.update(
            getData().map((s) => ({
                ...s,
                accessors,
                renderer: this.renderer,
                scales,
            }))
        );
    }

    private setUpStatusChart() {
        this.statusChart = new Chart(this.configureStatusGrid());
        this.statusChart.addPlugin(new InteractionLinePlugin());

        // Setting up the status chart scales
        const statusYScale = new BandScale();
        statusYScale.fixDomain(StatusAccessors.STATUS_DOMAIN);
        // Use the same 'x' scale id as the bar chart to ensure that interaction events such as hover are shared between the charts
        const statusXScale = new TimeIntervalScale(
            duration(5, "minutes"),
            this.xScaleId
        );
        statusXScale.fixDomain([
            moment(baseDate, format).toDate(),
            moment(baseDate, format).add(25, "minutes").toDate(),
        ]);
        const statusScales = {
            x: statusXScale,
            y: statusYScale,
        };

        // Setting up the status chart accessors
        const myStatusAccessors = statusAccessors(
            new MappedValueProvider<string>(getStatusValueMap())
        );
        myStatusAccessors.data.thickness = (data: any) =>
            data.status === Status.Up ? BarRenderer.THIN : BarRenderer.THICK;

        // The 'cssClassAccessor' updates the stroke color of the selection box when a time interval is selected
        // TODO: Implement 'selection-box' series for displaying the selection box on the status chart. For reference,
        // see 'selection-box' data series on the bar chart.
        myStatusAccessors.data.cssClass = this.cssClassAccessor;

        // Initializing the status chart
        this.statusChart.update(
            getStatusData().map((d) => ({
                ...d,
                accessors: myStatusAccessors,
                renderer: this.renderer,
                scales: statusScales,
            }))
        );
    }

    private configureBarGrid() {
        const gridConfig = new BarGridConfig();

        gridConfig.axis.left.visible = false;
        gridConfig.axis.left.gridTicks = false;
        // Disable 'axis.bottom.fit' to set left and right margins manually
        gridConfig.axis.bottom.fit = false;
        gridConfig.borders.top = new BorderConfig();
        gridConfig.cursor = "pointer";
        gridConfig.dimension.padding.top = 0;
        // Synchronize the left and right margins (left margin default is 30px)
        gridConfig.dimension.margin.right = gridConfig.dimension.margin.left;

        // Use these settings to make the bar chart the same height as the status chart
        // gridConfig.dimension.autoHeight = false;
        // gridConfig.dimension.height(30);

        return new XYGrid(gridConfig);
    }

    private configureStatusGrid() {
        const gridConfig = new BarStatusGridConfig();

        gridConfig.axis.bottom.visible = false;
        gridConfig.cursor = "pointer";
        gridConfig.dimension.margin.bottom = 0;
        // Synchronize the left and right margins (left margin default is 30px)
        gridConfig.dimension.margin.right = gridConfig.dimension.margin.left;
        gridConfig.borders.bottom.visible = false;

        return new XYGrid(gridConfig);
    }

    private redrawCharts() {
        this.barChart.update(this.barChart.getDataManager().chartSeriesSet);
        this.statusChart.update(
            this.statusChart.getDataManager().chartSeriesSet
        );
    }

    private handleDataPointsInteraction = (event: IChartEvent) => {
        const data: IInteractionDataPointsEvent = event.data;
        // we're interested in data point click events here
        if (data.interactionType === InteractionType.Click) {
            // set the selected data points
            this.selectedDataPoints = data.dataPoints;

            if (this.renderer.config.stateStyles) {
                // change the bar container opacity from 0.1 to 0.3
                this.renderer.config.stateStyles.deemphasized = {
                    opacity: 0.3,
                };
            }

            // redraw the charts to apply the selected data point style
            this.redrawCharts();

            // store the interaction label position for the selected data point
            this.selectedLabelPosition =
                this.calculateInteractionLabelPosition(data);

            // apply the label position based on the click
            this.barChart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        values: this.selectedLabelPosition,
                    },
                });
        }
    };

    private handleInteractionLabelUpdates = (event: IChartEvent) => {
        const data: IInteractionValuesPayload = event.data;

        // The condition checks whether the mouse has moved away from the chart and a selected label position is stored
        if (
            data.interactionType === InteractionType.MouseMove &&
            isEmpty(data.values) &&
            this.selectedLabelPosition
        ) {
            // ensure label updates are enabled
            this.labelPlugin.areLabelUpdatesEnabled = true;

            // Update the label with the stored label position by manually emitting an 'INTERACTION_VALUES_EVENT'.
            // Note that 'broadcast' is set to 'true' to let the 'nuiChartCollection' directive know that the event is
            // coming from outside the chart and should not propagate to other charts in the collection.
            this.barChart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .next({
                    data: {
                        interactionType: InteractionType.MouseMove,
                        values: this.selectedLabelPosition,
                    },
                    broadcast: true,
                });

            // disable further label updates
            this.labelPlugin.areLabelUpdatesEnabled = false;
        } else if (
            data.interactionType === InteractionType.MouseMove &&
            !isEmpty(data.values)
        ) {
            // allow label updates while the mouse is hovering over the chart
            this.labelPlugin.areLabelUpdatesEnabled = true;
        }
    };

    private handleMouseActive = (event: IChartEvent) => {
        if (this.renderer.config.stateStyles) {
            if (!isEmpty(this.selectedDataPoints) && !event.data) {
                // if there's a selected data point and the mouse has moved away
                // from the chart, set the bar container opacity to 0.3
                this.renderer.config.stateStyles.deemphasized = {
                    opacity: 0.3,
                };
            } else if (event.data) {
                // if the mouse is over the chart set the bar container opacity to 0.3
                this.renderer.config.stateStyles.deemphasized = {
                    opacity: 0.1,
                };
            }
        }

        if (
            this.barChart.getDataManager().chartSeriesSet.length > 0 &&
            this.statusChart.getDataManager().chartSeriesSet.length > 0
        ) {
            // redraw the charts if we have data
            this.redrawCharts();
        }
    };

    /**
     * Sets the width of the bars on the bar chart. (This is only necessary if you want the selection boxes
     * to be wider than the standard bars).
     */
    private barThickness(scales: IXYScales): DataAccessor<any, any> {
        return (
            d: any,
            i: number,
            series: any[],
            dataSeries: IDataSeries<IAccessors>
        ) => {
            let thickness: number;
            const x1 = convert(
                scales.x,
                dataSeries.accessors.data?.["startX"]?.(
                    d,
                    i,
                    dataSeries.data,
                    dataSeries
                ),
                0
            );
            const x2 = convert(
                scales.x,
                dataSeries.accessors.data?.["endX"]?.(
                    d,
                    i,
                    dataSeries.data,
                    dataSeries
                ),
                1
            );
            thickness = Math.abs(x1 - x2);

            // Allow the selection boxes to be a little wider than the data bars
            thickness -= dataSeries.id === "selection-box" ? 2 : 6;
            thickness = Math.max(thickness, BarRenderer.MIN_BAR_THICKNESS);
            return thickness;
        };
    }

    /**
     * Allows the 'BarHighlightingStrategy' to know which data point (or bar) on a series is selected, if any.
     * Return 'DATA_POINT_NOT_FOUND' if no data point is selected on the specified series.
     */
    private selectedDataPointIdxFn: SelectedDatPointIdxFn = (
        seriesId: string
    ): number =>
        this.selectedDataPoints?.[seriesId]?.index ?? DATA_POINT_NOT_FOUND;

    /**
     * Sets the stroke color of the selection box when a time interval is selected
     *
     * @returns The 'selected' class (see less file) if a bar is selected, the series id matches the selection box series, and the
     * selected data point index matches the current index; otherwise, returns an empty string.
     */
    private cssClassAccessor = (
        d: any,
        i: number,
        series: any,
        dataSeries: any
    ): string =>
        !isEmpty(this.selectedDataPoints) &&
        dataSeries.id === "selection-box" &&
        this.selectedDataPoints[dataSeries.id]?.index === i
            ? "selected"
            : "";

    /**
     * Calculates the desired position of the interaction label based on the position of the first data point in the event payload
     */
    private calculateInteractionLabelPosition(
        data: IInteractionDataPointsEvent
    ): IInteractionValues {
        const sampleDataPoint =
            data.dataPoints[Object.keys(data.dataPoints)[0]];
        const xScales = [sampleDataPoint.dataSeries.scales.x];
        const yScales = [sampleDataPoint.dataSeries.scales.y];

        if (
            !sampleDataPoint.position ||
            isUndefined(sampleDataPoint.position.width) ||
            isUndefined(sampleDataPoint.position.height)
        ) {
            throw new Error("Can't calculate x and y values");
        }

        const xCoordinate =
            sampleDataPoint.position.x + sampleDataPoint.position.width / 2;
        const yCoordinate =
            sampleDataPoint.position.y + sampleDataPoint.position.height / 2;

        return UtilityService.getXYValues(
            xScales,
            yScales,
            xCoordinate,
            yCoordinate
        );
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            data: [
                { category: moment(baseDate, format).toDate(), value: 66 },
                {
                    category: moment(baseDate, format)
                        .add(5, "minutes")
                        .toDate(),
                    value: 14,
                },
                {
                    category: moment(baseDate, format)
                        .add(10, "minutes")
                        .toDate(),
                    value: 25,
                },
                {
                    category: moment(baseDate, format)
                        .add(15, "minutes")
                        .toDate(),
                    value: 55,
                },
                {
                    category: moment(baseDate, format)
                        .add(20, "minutes")
                        .toDate(),
                    value: 33,
                },
                {
                    category: moment(baseDate, format)
                        .add(25, "minutes")
                        .toDate(),
                    value: 5,
                },
            ],
        },

        // The sole purpose of this series is to define the selection boxes that have a togglable selection
        // outline. The 'fill' of the boxes is set to transparent by the 'colorProvider' in the component
        // above. And, the blue outline of the selected time interval is toggled by the 'cssClassAccessor'
        // method in the above component.
        {
            id: "selection-box",
            data: [
                { category: moment(baseDate, format).toDate(), value: 100 },
                {
                    category: moment(baseDate, format)
                        .add(5, "minutes")
                        .toDate(),
                    value: 100,
                },
                {
                    category: moment(baseDate, format)
                        .add(10, "minutes")
                        .toDate(),
                    value: 100,
                },
                {
                    category: moment(baseDate, format)
                        .add(15, "minutes")
                        .toDate(),
                    value: 100,
                },
                {
                    category: moment(baseDate, format)
                        .add(20, "minutes")
                        .toDate(),
                    value: 100,
                },
                {
                    category: moment(baseDate, format)
                        .add(25, "minutes")
                        .toDate(),
                    value: 100,
                },
            ],
        },
    ];
}

function getStatusValueMap() {
    return {
        [Status.Up]: CHART_PALETTE_CS_S_EXTENDED[8],
        [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
        [Status.Critical]: CHART_PALETTE_CS_S_EXTENDED[2],
    };
}

function getStatusData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    status: Status.Up,
                    start: moment(baseDate, format).toDate(),
                    end: moment(baseDate, format).toDate(),
                },
                {
                    status: Status.Warning,
                    start: moment(baseDate, format).add(5, "minutes").toDate(),
                    end: moment(baseDate, format).add(5, "minutes").toDate(),
                },
                {
                    status: Status.Critical,
                    start: moment(baseDate, format).add(10, "minutes").toDate(),
                    end: moment(baseDate, format).add(10, "minutes").toDate(),
                },
                {
                    status: Status.Up,
                    start: moment(baseDate, format).add(15, "minutes").toDate(),
                    end: moment(baseDate, format).add(15, "minutes").toDate(),
                },
                {
                    status: Status.Critical,
                    start: moment(baseDate, format).add(20, "minutes").toDate(),
                    end: moment(baseDate, format).add(20, "minutes").toDate(),
                },
                {
                    status: Status.Up,
                    start: moment(baseDate, format).add(25, "minutes").toDate(),
                    end: moment(baseDate, format).add(25, "minutes").toDate(),
                },
            ],
        },
    ];
}
