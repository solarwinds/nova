import { RenderState } from "../../renderers/types";
import {
    IAccessors,
    IChart,
    IChartAssistSeries,
    IChartSeries,
    IRenderStateData,
} from "../common/types";

/**
 * Interface representing the spark chart assist's
 * association between one of its charts and a series set
 */
export interface ISpark<TA extends IAccessors> {
    chartSeriesSet: IChartAssistSeries<TA>[];
    id?: string;
    chart?: IChart;
}

/**
 * Interface representing an assistant that aids in chart usage
 */
export interface IChartAssist {
    /**
     * Updates the series set for the chart assist's associated chart
     *
     * @param inputSeriesSet The updated set of series
     */
    update(inputSeriesSet: IChartAssistSeries<IAccessors>[]): void;

    /**
     * Gets the current highlighted value for the specified series
     *
     * @param {IChartSeries<IAccessors>} chartSeries The chart series to get the highlighted value for
     * @param {string} scaleKey The key for the datapoint value scale
     * @param {string} [formatterName] The name of the formatter if a custom formatter name is set on the scale
     *
     * @returns {string} The highlighted value
     */
    getHighlightedValue(
        chartSeries: IChartSeries<IAccessors>,
        scaleKey: string,
        formatterName?: string
    ): string | number | undefined;

    /**
     * Returns visible series that are represented by a legend
     */
    getVisibleSeriesWithLegend(): IChartAssistSeries<IAccessors>[];
}

/** Event types that can be emitted from a chart assist */
export enum ChartAssistEventType {
    ToggleSeries = "ToggleSeries",
    ResetVisibleSeries = "ResetVisibleSeries",
    EmphasizeSeries = "EmphasizeSeries",
}

/** Interface for chart assist events */
export interface IChartAssistEvent {
    type: ChartAssistEventType;
    payload: any;
}

/**
 * Legend interaction assist uses this class to present the state that consists of emphasisState+visible as one state
 */
export class ChartAssistRenderStateData implements IRenderStateData {
    constructor(
        public seriesId: string,
        public series: IChartAssistSeries<IAccessors>,
        public emphasisState = RenderState.default,
        public visible = true
    ) {}

    get state(): RenderState {
        return this.visible ? this.emphasisState : RenderState.hidden;
    }
}

export interface IRenderStatesIndex
    extends Record<string, ChartAssistRenderStateData> {}
