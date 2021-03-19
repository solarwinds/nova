import { select, Selection } from "d3-selection";
import each from "lodash/each";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DESTROY_EVENT, SERIES_STATE_CHANGE_EVENT } from "../constants";

import { ChartPlugin } from "./common/chart-plugin";
import { DataManager } from "./common/data-manager";
import { EventBus } from "./common/event-bus";
import { Lasagna } from "./common/lasagna";
import { RenderEngine } from "./common/render-engine";
import { D3Selection, IAccessors, IChart, IChartEvent, IChartPlugin, IChartSeries, IRenderStateData } from "./common/types";
import { IDimensionConfig, IDimensions, IGrid } from "./grid/types";
import { RenderEnginePlugin } from "./plugins/render-engine-plugin";
import { CssFilterId, GRAYSCALE_COLOR_MATRIX } from "./types";

export class Chart implements IChart {
    public readonly eventBus = new EventBus<IChartEvent>();
    public element: HTMLElement;
    public target?: D3Selection<SVGSVGElement>;
    public filterDefs?: Selection<SVGDefsElement, any, SVGElement, any>;

    private dataManager: DataManager; // TODO: interface
    private renderEngine: RenderEngine; // TODO: interface

    private updateSubject = new BehaviorSubject<IChartSeries<IAccessors>[]>([]);
    private updateDimensionsSubject = new Subject<void>();
    private seriesStatesSubject = new BehaviorSubject<IRenderStateData[]>([]);

    private plugins: IChartPlugin[] = [];

    constructor(private grid: IGrid) {
        if (!grid) {
            throw new Error("Grid has to be defined!");
        }
        grid.updateChartDimensionsSubject = this.updateDimensionsSubject;
        grid.eventBus = this.eventBus;
    }

    public getEventBus(): EventBus<IChartEvent> {
        return this.eventBus;
    }

    public getDataManager(): DataManager {
        return this.dataManager;
    }

    public getRenderEngine(): RenderEngine {
        return this.renderEngine;
    }

    public getGrid(): IGrid {
        return this.grid;
    }

    public addPlugin(plugin: IChartPlugin) {
        plugin.chart = this;
        this.plugins.push(plugin);
    }

    public removePlugin(classRef: typeof ChartPlugin) {
        const pluginIndex = this.plugins.findIndex(plugin => plugin instanceof classRef);
        if (-1 !== pluginIndex) {
            this.plugins[pluginIndex].destroy();
            this.plugins.splice(pluginIndex, 1);
        }
    }

    public addPlugins(...plugins: IChartPlugin[]) {
        for (const plugin of plugins) {
            this.addPlugin(plugin);
        }
    }

    public removePlugins(...classRefs: (typeof ChartPlugin)[]) {
        for (const classRef of classRefs) {
            this.removePlugin(classRef);
        }
    }

    public hasPlugin(classRef: typeof ChartPlugin) {
        return -1 !== this.plugins.findIndex(plugin => plugin instanceof classRef);
    }

    public build(element: HTMLElement) {
        this.element = element;

        // @ts-ignore: Workaround to avoid strict build crash because of type
        this.target = select<HTMLElement, SVGElement>(this.element)
            .append("svg")
            .attrs({
                "class": "nui-chart",
                "height": "100%",
                "width": "100%",
            });

        this.configureCssFilters();
        this.buildGrid();

        this.dataManager = this.buildDataManager();
        this.renderEngine = this.buildRenderEngine(this.grid.getLasagna(), this.dataManager);

        this.addPlugin(new RenderEnginePlugin());

        for (const gridPlugin of this.getGrid().buildPlugins(this)) {
            this.addPlugin(gridPlugin);
        }

        this.initialize();

        const untilDestroy = <T>() => takeUntil<T>(this.getEventBus().getStream(DESTROY_EVENT));
        this.updateSubject.pipe(untilDestroy())
            .subscribe((d: IChartSeries<IAccessors>[]) => this.onUpdate(d));
        this.updateDimensionsSubject.pipe(untilDestroy())
            .subscribe(() => this.onUpdateDimensions());
        this.seriesStatesSubject.pipe(untilDestroy())
            .subscribe((rs: IRenderStateData[]) => this.onSetSeriesStates(rs));
    }

    private configureCssFilters() {
        this.filterDefs = this.target?.append("defs");

        // filter for applying a grayscale appearance to svg elements
        this.filterDefs?.append("filter")
            .attr("id", CssFilterId.Grayscale)
            .append("feColorMatrix")
            .attr("type", "matrix")
            .attr("values", GRAYSCALE_COLOR_MATRIX);
    }

    protected buildDataManager(): DataManager {
        return new DataManager();
    }

    protected buildGrid() {
        if (this.target) {
            this.grid.target(this.target);
            this.grid.build();

            this.updateTargetDimensions(this.grid.config().dimension);
        }
    }

    protected buildRenderEngine(lasagna: Lasagna, dataManager: DataManager): RenderEngine {
        return new RenderEngine(lasagna, dataManager);
    }

    public update(seriesSet: IChartSeries<IAccessors>[]) {
        this.updateSubject.next(seriesSet);
    }

    public updateDimensions() {
        this.updateDimensionsSubject.next();
    }

    public initialize() {
        each(this.plugins, (p: IChartPlugin) => {
            p.initialize();
        });
    }

    public destroy() {
        this.eventBus.getStream(DESTROY_EVENT).next({ data: null });
        this.eventBus.destroy();

        this.plugins.forEach(p => p.destroy());

        this.target?.remove();
        this.target = undefined;
    }

    public setSeriesStates(renderStateData: IRenderStateData[]) {
        this.seriesStatesSubject.next(renderStateData);
        this.eventBus.getStream(SERIES_STATE_CHANGE_EVENT).next({ data: renderStateData });
    }

    private onUpdate(seriesSet: IChartSeries<IAccessors>[]) {
        this.dataManager.update(seriesSet);

        this.grid.scales = this.dataManager.scalesIndexByKey;
        this.dataManager.updateScaleDomains();
        this.grid.updateRanges();

        this.plugins.forEach(p => p.update());
    }

    private onUpdateDimensions() {
        const dimensionConfig = this.grid.config().dimension;

        // if the chart is reused with different grid dimensions, the chart's container dimensions need to be adjusted as well
        this.updateTargetDimensions(dimensionConfig);

        const dimensions: Partial<IDimensions> = {};
        if (dimensionConfig.autoHeight) {
            dimensions.height = this.element.clientHeight;
        }
        if (dimensionConfig.autoWidth) {
            dimensions.width = this.element.clientWidth;
        }
        this.grid.updateDimensions(dimensions);

        this.plugins.forEach(p => p.updateDimensions());
    }

    private updateTargetDimensions(dimensionConfig: IDimensionConfig) {
        if (!dimensionConfig.autoHeight) {
            // use style instead of attr to override css style
            this.target?.style("height", dimensionConfig.outerHeight() + "px");
        }
        if (!dimensionConfig.autoWidth) {
            // use style instead of attr to override css style
            this.target?.style("width", dimensionConfig.outerWidth() + "px");
        }
    }

    private onSetSeriesStates(renderStateData: IRenderStateData[]) {
        this.renderEngine.setSeriesStates(renderStateData);
    }
}
