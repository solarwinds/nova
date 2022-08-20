import cloneDeep from "lodash/cloneDeep";

import {
    INTERACTION_DATA_POINTS_EVENT,
    MOUSE_ACTIVE_EVENT,
} from "../../constants";
import { XYGridConfig } from "../../core/grid/config/xy-grid-config";
import { RenderState } from "../../renderers/types";
import { Chart } from "../chart";
import { EventBus } from "../common/event-bus";
import { ChartPalette } from "../common/palette/chart-palette";
import { CHART_MARKERS, CHART_PALETTE_CS1 } from "../common/palette/palettes";
import { SequentialChartMarkerProvider } from "../common/palette/sequential-chart-marker-provider";
import {
    IAccessors,
    IChartAssistSeries,
    IChartEvent,
    IChartMarker,
    IChartPalette,
    IChartSeries,
    IDataPointsPayload,
    InteractionType,
    IValueProvider,
} from "../common/types";
import { UtilityService } from "../common/utility.service";
import { sparkChartGridConfig } from "../grid/config/spark-chart-grid-config";
import { XYGrid } from "../grid/xy-grid";
import { InteractionLabelPlugin } from "../plugins/interaction/interaction-label-plugin";
import { InteractionLinePlugin } from "../plugins/interaction/interaction-line-plugin";

import { ChartAssist } from "./chart-assist";
import { IChartAssist, ISpark } from "./types";

/**
 * Chart assist implementation to be used with spark charts
 */
export class SparkChartAssist implements IChartAssist {
    /** Collection of ISpark objects */
    public sparks: ISpark<IAccessors>[] = [];
    /** Used for keeping tabs on the legend's active state */
    public isLegendActive = false;
    /** Grid config for all sparks except the last (bottom) one */
    public readonly gridConfig: XYGridConfig;
    /** Grid config for the last (bottom) spark */
    public readonly lastGridConfig: XYGridConfig;

    public highlightedDataPoints: IDataPointsPayload = {};

    constructor(
        public readonly showBottomAxis = true,
        public readonly showTopBorder = true,
        public palette: IChartPalette = new ChartPalette(CHART_PALETTE_CS1),
        public markers: IValueProvider<IChartMarker> = new SequentialChartMarkerProvider(
            CHART_MARKERS
        )
    ) {
        this.gridConfig = sparkChartGridConfig(
            new XYGridConfig(),
            false,
            showTopBorder
        );
        this.gridConfig.interactionPlugins = false;

        this.lastGridConfig = sparkChartGridConfig(
            new XYGridConfig(),
            showBottomAxis,
            showTopBorder
        );
        this.lastGridConfig.interactionPlugins = false;
    }

    /**
     * Use this method to update the set of sparks if they all consist of only one series.
     * If one or more sparks has multiple series use the updateSparks method instead.
     *
     * See {@link IChartAssist#update}
     */
    public update(inputSeriesSet: IChartAssistSeries<IAccessors>[]): void {
        const sparks = inputSeriesSet.map((chartSeries) => ({
            id: chartSeries.id,
            chartSeriesSet: [chartSeries],
        }));
        this.updateSparks(sparks);
    }

    /**
     * Use this method to update the set of sparks if any of them consist of more than one series.
     *
     * @param {ISpark<IAccessors>[]} sparks The collection of sparks to update
     */
    public updateSparks(sparks: ISpark<IAccessors>[]): void {
        const inputSparks = cloneDeep(sparks);
        this.sparks = inputSparks.map((spark, index): ISpark<IAccessors> => {
            const lastSpark = index === inputSparks.length - 1;
            const existingSparkIndex = spark.id
                ? this.sparks.findIndex(
                      (existingSpark) => existingSpark.id === spark.id
                  )
                : -1;
            if (existingSparkIndex !== -1) {
                spark.chart = this.reconfigureChart(
                    this.sparks[existingSparkIndex].chart as Chart,
                    lastSpark
                );
            } else {
                spark.chart = spark.chart || this.createChart(lastSpark);
                spark.id = spark.id || UtilityService.uuid();
            }

            spark.chart.update(spark.chartSeriesSet);

            return spark;
        });
    }

    /** See {@link IChartAssist#getHighlightedValue} */
    public getHighlightedValue(
        chartSeries: IChartSeries<IAccessors>,
        scaleKey: string,
        formatterName?: string
    ): string | number {
        return ChartAssist.getLabel(
            chartSeries,
            this.highlightedDataPoints[chartSeries.id],
            scaleKey,
            formatterName
        );
    }

    /**
     * To use the for-cycle trackBy, set the id value on each spark
     * and assign this function to the ngFor trackBy property
     */
    public trackByFn(_index: number, spark: ISpark<IAccessors>) {
        return spark.id;
    }

    public setRenderState(_seriesId: string, _state: RenderState): void {
        // not used
    }

    public getVisibleSeriesWithLegend(): IChartAssistSeries<IAccessors>[] {
        return [];
    }

    protected createChart(lastSpark: boolean) {
        const grid = new XYGrid(
            lastSpark ? this.lastGridConfig : this.gridConfig
        );
        const chart = new Chart(grid);

        if (this.showTopBorder || this.showBottomAxis) {
            chart.addPlugin(new InteractionLinePlugin());
        }
        if (lastSpark && this.showBottomAxis) {
            chart.addPlugin(new InteractionLabelPlugin());
        }

        this.configureEventSubscriptions(chart.getEventBus());

        return chart;
    }

    private configureEventSubscriptions(eventBus: EventBus<IChartEvent>): void {
        eventBus.getStream(INTERACTION_DATA_POINTS_EVENT).subscribe((event) => {
            if (event.data.interactionType === InteractionType.MouseMove) {
                const dataPoints = <IDataPointsPayload>event.data.dataPoints;
                Object.keys(dataPoints).forEach((seriesId) => {
                    this.highlightedDataPoints[seriesId] = Object.assign(
                        {},
                        dataPoints[seriesId]
                    );
                });
            }
        });
        eventBus.getStream(MOUSE_ACTIVE_EVENT).subscribe((event) => {
            this.isLegendActive = event.data;
        });
    }

    private reconfigureChart(chart: Chart, lastSpark: boolean): Chart {
        chart
            .getGrid()
            .config(lastSpark ? this.lastGridConfig : this.gridConfig);
        chart.updateDimensions();

        const hasInteractionLabel = chart.hasPlugin(InteractionLabelPlugin);
        if (lastSpark && !hasInteractionLabel && this.showBottomAxis) {
            const labelPlugin = new InteractionLabelPlugin();
            chart.addPlugin(labelPlugin);
            labelPlugin.initialize();
        } else if (!lastSpark && hasInteractionLabel) {
            chart.removePlugin(InteractionLabelPlugin);
        }

        return chart;
    }
}
