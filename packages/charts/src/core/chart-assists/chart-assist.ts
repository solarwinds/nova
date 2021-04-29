import each from "lodash/each";
import keyBy from "lodash/keyBy";
import values from "lodash/values";
import { Observable, of, Subject, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

import { DESTROY_EVENT, HIGHLIGHT_SERIES_EVENT, INTERACTION_DATA_POINTS_EVENT, MOUSE_ACTIVE_EVENT } from "../../constants";
import { RenderState } from "../../renderers/types";
import { EventBus } from "../common/event-bus";
import { defaultMarkerProvider, defaultPalette } from "../common/palette/default-providers";
import {
    IAccessors,
    IChart,
    IChartAssistSeries,
    IChartEvent,
    IChartMarker,
    IChartPalette,
    IChartSeries,
    IDataPoint,
    IDataPointsPayload,
    IInteractionDataPointsEvent,
    InteractionType,
    IRenderStateData,
    IValueProvider
} from "../common/types";

import { ChartAssistEventType, ChartAssistRenderStateData, IChartAssist, IChartAssistEvent, IRenderStatesIndex } from "./types";

/** @ignore */
const chartAssistSeriesDefaults: Partial<IChartAssistSeries<IAccessors>> = {
    showInLegend: true,
    preprocess: true,
};

/**
 * Helper class that helps to bootstrap a chart with legend, using data pre-processor.
 * It will use the most common settings.
 */
export class ChartAssist<T = IAccessors> implements IChartAssist {

    /**
     * Retrieves the display value for a data point on the specified series
     *
     * @param chartSeries The series containing the data point to get a label for
     * @param dataPoint The data point to get a label for
     * @param scaleKey The key for the scale potentially containing a formatter that can be used to format the label
     * @param formatterName The name of the formatter to use for formatting the label
     * @param dataAccessorKey The accessor key to use for accessing the data value if the accessor key differs from the scale key
     *
     * @returns The display value for a data point
     */
    public static getLabel(chartSeries: IChartSeries<IAccessors>, dataPoint: any, scaleKey: string, formatterName?: string, dataAccessorKey?: string): any {
        if (!dataPoint || chartSeries.data.length === 0) {
            return null;
        }

        const valueAccessor = chartSeries.accessors.data?.[dataAccessorKey || scaleKey];
        if (!valueAccessor) {
            return null;
        }

        const adjustedIndex = dataPoint.index < 0 ? chartSeries.data.length - 1 : dataPoint.index;
        const data = chartSeries.data[adjustedIndex];

        const rawValue = valueAccessor(data, adjustedIndex, chartSeries.data, chartSeries);
        const scale = chartSeries.scales[scaleKey];
        if (!scale || !formatterName) {
            return rawValue;
        }

        const formatter = scale.formatters[formatterName];
        if (!formatter) {
            return rawValue;
        }

        return formatter(rawValue);
    }

    public highlightedDataPoints: IDataPointsPayload;
    public isLegendActive = false;
    public inputSeriesSet: IChartAssistSeries<IAccessors>[] = [];
    public legendSeriesSet: IChartAssistSeries<IAccessors>[] = [];

    /**
     * Subject for subscribing to IChartAssistEvents such as
     * ToggleSeries, EmphasizeSeries, and ResetVisibleSeries
     */
    public chartAssistSubject = new Subject<IChartAssistEvent>();

    private syncHandlerMap: Record<ChartAssistEventType, any>;
    private getVisibleSeriesWithLegendBackup: () => IChartAssistSeries<IAccessors<any>>[];
    private syncSubscription: Subscription;
    private legendInteractionAssist: LegendInteractionAssist;

    public onEvent: (event: IChartEvent) => void;

    constructor(public chart: IChart,
                seriesProcessor?: (series: IChartAssistSeries<T>[]) => IChartAssistSeries<T>[],
                public palette: IChartPalette = defaultPalette(),
                public markers: IValueProvider<IChartMarker> = defaultMarkerProvider()) {
        this.configureChartEventSubscriptions(chart.getEventBus());
        if (seriesProcessor) {
            this.seriesProcessor = seriesProcessor;
        }

        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        this.legendInteractionAssist = new LegendInteractionAssist(this);

        this.syncHandlerMap = {
            [ChartAssistEventType.EmphasizeSeries]: this.emphasizeSeries,
            [ChartAssistEventType.ResetVisibleSeries]: this.resetVisibleSeries,
            [ChartAssistEventType.ToggleSeries]: this.toggleSeries,
        };
    }

    public get renderStatesIndex(): IRenderStatesIndex {
        return this.legendInteractionAssist.renderStatesIndex;
    }

    /**
     * Convenience stream of highlight events that can be used to populate legend.
     * It will return highlighted value for the series (while hovering over datapoints) or the last value from series (while not hovering over and if possible),
     * otherwise it'll return null
     * @param chartSeries
     */
    public legendLabelData$(chartSeries: IChartSeries<IAccessors>): Observable<any> {
        const seriesHighlight$ = this.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).asObservable()
            .pipe(
                filter(event => event.data.interactionType === InteractionType.MouseMove),
                map(event => event.data.dataPoints[chartSeries.id])
            );

        // if there is no highlightData, or index is "-1", we'll show the last value from series (if possible)
        const highlightDataPresentPredicate = (highlightData: any) => highlightData && highlightData.index >= 0;

        return seriesHighlight$
            .pipe(
                switchMap(highlightData => highlightDataPresentPredicate(highlightData)
                    ? of(highlightData.data)
                    : of((chartSeries.data && chartSeries.data.length) ? chartSeries.data[chartSeries.data.length - 1] : null))
            );
    }

    public seriesProcessor(series: IChartAssistSeries<IAccessors>[]): IChartAssistSeries<IAccessors>[] {
        return series;
    }

    public update(inputSeriesSet: IChartAssistSeries<IAccessors>[], updateLegend = true): void {
        this.inputSeriesSet = inputSeriesSet;

        const processedSeriesSet = this.seriesProcessor(inputSeriesSet.map(series => ({
            ...series,
            data: series.data || [],
        })));

        const seriesSet = processedSeriesSet.map(s => this.applyDefaults(s));

        this.legendSeriesSet = seriesSet.filter(s => s.showInLegend);

        if (updateLegend) {
            this.legendInteractionAssist.update(seriesSet);
        }
        this.chart.update(seriesSet);

        this.publishRenderStates();
    }

    public toggleSeries = (seriesId: string, visible: boolean): void => {
        this.legendInteractionAssist.setGroupVisibility(seriesId, visible);

        this.update(this.inputSeriesSet, false);
        this.chartAssistSubject.next({ type: ChartAssistEventType.ToggleSeries, payload: { seriesId, visible } });
    }

    /**
     * Resets all visible series to default state
     */
    public resetVisibleSeries = (): void => {
        this.legendInteractionAssist.resetSeries();

        this.publishRenderStates();
        this.chartAssistSubject.next({ type: ChartAssistEventType.ResetVisibleSeries, payload: {} });
    }

    /**
     * For series that are currently visible, emphasize the given series and deemphasizes all the other ones
     *
     * @param seriesId
     */
    public emphasizeSeries = (seriesId: string): void => {
        this.legendInteractionAssist.emphasizeSeries(seriesId);

        this.publishRenderStates();
        this.chartAssistSubject.next({ type: ChartAssistEventType.EmphasizeSeries, payload: { seriesId } });
    }

    public isSeriesHidden(seriesId: string): boolean {
        return this.legendInteractionAssist.isSeriesHidden(seriesId);
    }

    public seriesTrackByFn(index: number, item: IChartAssistSeries<IAccessors>): string {
        return item.id;
    }

    /**
    * Retrieves the display value for the highlighted data point on the specified series
    *
    * @param chartSeries The series containing the highlighted data point to get a label for
    * @param scaleKey The key for the scale potentially containing a formatter that can be used to format the label
    * @param formatterName The name of the formatter to use for formatting the label
    * @param dataAccessorKey The accessor key to use for accessing the data value if the accessor key differs from the scale key
    *
    * @returns The display value for the highlighted data point
    */
    public getHighlightedValue(chartSeries: IChartSeries<IAccessors>,
                               scaleKey: string,
                               formatterName?: string,
                               dataAccessorKey?: string): string | number | undefined {

        if (!this.highlightedDataPoints) {
            return undefined;
        }

        const dataPoint = this.highlightedDataPoints[chartSeries.id];
        return ChartAssist.getLabel(chartSeries, dataPoint, scaleKey, formatterName, dataAccessorKey);
    }

    public getVisibleSeriesWithLegend = (): IChartAssistSeries<IAccessors<any>>[] =>
        this.legendSeriesSet.filter(s => !this.isSeriesHidden(s.id))

    /**
     * Synchronize this chart assist's actions with IChartAssistEvents emitted by the specified
     * chart assist, and override this chart assist's getVisibleSeriesWithLegend method with the
     * specified chart assist's getVisibleSeriesWithLegend.
     *
     * Note: If the chart instance of the specified chart assist is replaced by a new chart,
     * this method must be invoked again to resume synchronized behavior.
     *
     * @param {ChartAssist} chartAssist The chart assist to synchronize with
     */
    public syncWithChartAssist(chartAssist: ChartAssist): void {
        this.getVisibleSeriesWithLegendBackup = this.getVisibleSeriesWithLegend;
        this.getVisibleSeriesWithLegend = chartAssist.getVisibleSeriesWithLegend;

        this.syncSubscription = chartAssist.chartAssistSubject.pipe(
            takeUntil(chartAssist.chart.getEventBus().getStream(DESTROY_EVENT))
        ).subscribe((event: IChartAssistEvent) => {
            const args = Object.keys(event.payload).map(key => event.payload[key]);
            this.syncHandlerMap[event.type](...args);
        });
    }

    /**
     * Unsynchronize this chart assist's actions from those of the chart assist
     * specified in a previous syncWithChartAssist call, and restore this chart
     * assist's getVisibleSeriesWithLegend method with the instance used before
     * syncWithChartAssist was called.
     */
    public unsyncChartAssist(): void {
        this.getVisibleSeriesWithLegend = this.getVisibleSeriesWithLegendBackup;

        if (this.syncSubscription) {
            this.syncSubscription.unsubscribe();
        }
    }

    private configureChartEventSubscriptions(eventBus: EventBus<IChartEvent>): void {
        const eventHandlers: { [eventName: string]: (data?: any) => void } = {
            [INTERACTION_DATA_POINTS_EVENT]: (data: IInteractionDataPointsEvent) => {
                if (data.interactionType === InteractionType.MouseMove) {
                    this.highlightedDataPoints = Object.assign({}, data.dataPoints);
                }
            },
            [HIGHLIGHT_SERIES_EVENT]: (data: IDataPoint) => {
                if (data.index >= 0) {
                    this.emphasizeSeries(data.seriesId);
                } else {
                    this.resetVisibleSeries();
                }
            },
            [MOUSE_ACTIVE_EVENT]: (data: boolean) => {
                this.isLegendActive = data;
            },
        };

        each(Object.keys(eventHandlers), key => {
            eventBus.getStream(key).subscribe((event) => {
                eventHandlers[key](event.data);
                if (this.onEvent) {
                    this.onEvent(event);
                }
            });
        });
    }

    private publishRenderStates(): void {
        this.chart.setSeriesStates(this.legendInteractionAssist.getSeriesStates());
    }

    private applyDefaults(chartSeries: IChartSeries<IAccessors>): IChartAssistSeries<IAccessors> {
        return Object.assign({}, chartAssistSeriesDefaults, chartSeries);
    }
}

export class LegendInteractionAssist {

    private seriesGroups: Record<string, string[]> = {};
    private seriesIndex: Record<string, IChartAssistSeries<IAccessors>>;

    public renderStatesIndex: IRenderStatesIndex = {};

    constructor(private chartAssist: ChartAssist) {
    }

    public update(seriesSet: IChartAssistSeries<IAccessors>[]): void {
        this.seriesGroups = this.getSeriesGroups(seriesSet);
        this.seriesIndex = keyBy(seriesSet, s => s.id);

        this.resetSeries();

        // override render states
        for (const series of seriesSet.filter(s => s.renderState)) {
            this.renderStatesIndex[series.id] =
                new ChartAssistRenderStateData(series.id,
                                               series,
                                               series.renderState === RenderState.hidden ? RenderState.default : series.renderState,
                                               series.renderState !== RenderState.hidden);
        }
    }

    public getSeriesStates(): IRenderStateData[] {
        return values(this.renderStatesIndex);
    }

    public isSeriesHidden(seriesId: string): boolean {
        const renderState = this.renderStatesIndex[seriesId];
        return renderState && !renderState.visible;
    }

    private getSeriesGroups(seriesSet: IChartAssistSeries<IAccessors>[]) {
        const seriesGroups: Record<string, string[]> = {};

        for (const s of seriesSet) {
            const separatorIndex = s.id.indexOf("__");
            const parentId = (separatorIndex >= 0) ? s.id.substring(0, separatorIndex) : s.id;

            if (!seriesGroups[parentId]) {
                seriesGroups[parentId] = [];
            }
            seriesGroups[parentId].push(s.id);
        }

        return seriesGroups;
    }

    /**
     * @param groupId id of the parent series
     * @param renderState
     */
    public setGroupState(groupId: string, renderState: RenderState): void {
        if (!this.seriesGroups[groupId]) {
            return;
        }

        for (const s of this.seriesGroups[groupId]) {
            this.setRenderState(s, renderState);
        }
    }

    /**
     * @param groupId id of the parent series
     * @param visible
     */
    public setGroupVisibility(groupId: string, visible: boolean): void {
        if (!this.seriesGroups[groupId]) {
            return;
        }

        for (const s of this.seriesGroups[groupId]) {
            this.setVisibility(s, visible);
        }
    }

    public emphasizeSeries(seriesId: string): void {
        for (const group of Object.keys(this.seriesGroups)) {
            this.setGroupState(group, group === seriesId ? RenderState.emphasized : RenderState.deemphasized);
        }
    }

    public resetSeries(): void {
        const legendSeries = this.chartAssist.getVisibleSeriesWithLegend();
        const oneSeriesMode = legendSeries.length === 1;

        if (oneSeriesMode) {
            this.emphasizeSeries(legendSeries[0].id);
        } else {
            for (const group of Object.keys(this.seriesGroups)) {
                this.setGroupState(group, RenderState.default);
            }
        }
    }

    private setRenderState(seriesId: string, state: RenderState) {
        let renderState = this.renderStatesIndex[seriesId];
        if (renderState) {
            renderState.emphasisState = state;
        } else {
            renderState = new ChartAssistRenderStateData(seriesId, this.seriesIndex[seriesId], state);
            this.renderStatesIndex[seriesId] = renderState;
        }
    }

    private setVisibility(seriesId: string, visible: boolean) {
        let renderState = this.renderStatesIndex[seriesId];
        if (renderState) {
            renderState.visible = visible;
        } else {
            renderState = new ChartAssistRenderStateData(seriesId, this.seriesIndex[seriesId], RenderState.default, visible);
            this.renderStatesIndex[seriesId] = renderState;
        }
    }

}
