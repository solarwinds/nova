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

import { Injectable } from "@angular/core";

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    ChartAssist,
    IAccessors,
    IBarChartConfig,
    IChartAssistSeries,
    IChartMarker,
    IDataSeries,
    IGrid,
    IRadialAccessors,
    IValueProvider,
    PieRenderer,
    radial,
    RadialAccessors,
    radialGrid,
    RadialRenderer,
    radialScales,
    Renderer,
    Scales,
} from "@nova-ui/charts";

import { ProportionalWidgetChartTypes } from "../components/proportional-widget/types";

type PreprocessorType<T extends IAccessors> = (
    this: ChartAssist,
    series: IChartAssistSeries<T>[]
) => IChartAssistSeries<T>[];

export interface IChartAttributes<T extends IAccessors = IAccessors> {
    grid: IGrid;
    accessors: IAccessors;
    renderer: Renderer<IAccessors>;
    scales: Scales;
    preprocessor?: PreprocessorType<T>;
}

interface IChartTools<T extends IAccessors = IAccessors> {
    config?: IBarChartConfig;
    preprocessor?: PreprocessorType<T>;
    gridFunction: () => IGrid;
    rendererFunction: () => Renderer<IAccessors>;
    accessorFunction: (
        colors?: IValueProvider<string>,
        markers?: IValueProvider<IChartMarker>
    ) => IAccessors;
    scaleFunction: () => Scales;
}

@Injectable()
export class CategoryChartUtilService {
    /**
     *  Combines each of IDataSeries with accessors, renderer and scales provided
     *
     * @param data
     * @param accessors
     * @param renderer
     * @param scales
     *
     * @returns resulting set of IChartAssistSeries
     */
    public static buildChartSeries(
        data: IDataSeries<IAccessors>[],
        accessors: IAccessors,
        renderer: Renderer<IAccessors>,
        scales: Scales
    ): IChartAssistSeries<IAccessors>[] {
        const result = (data || []).map((s) => ({
            ...s,
            accessors,
            renderer,
            scales,
        }));
        return result;
    }

    public static getChartAttributes(
        chartType: ProportionalWidgetChartTypes,
        colors?: IValueProvider<string>,
        markers?: IValueProvider<IChartMarker>
    ): IChartAttributes | IChartAttributes<IRadialAccessors> {
        const t: IChartTools | IChartTools<IRadialAccessors> =
            CategoryChartUtilService.getChartTools(chartType);
        const result: IChartAttributes | IChartAttributes<IRadialAccessors> = {
            grid: t.gridFunction(),
            accessors: t.accessorFunction(colors, markers),
            renderer: t.rendererFunction(),
            scales: t.scaleFunction(),
        };

        if (t.preprocessor) {
            result.preprocessor =
                t.preprocessor as PreprocessorType<IRadialAccessors>;
        }
        return result;
    }

    private static getChartTools(
        chartType: ProportionalWidgetChartTypes
    ): IChartTools | IChartTools<IRadialAccessors> {
        const radialChartAccessors = (colors: IValueProvider<string>) => {
            const accessors = new RadialAccessors(colors);
            accessors.series.color = (seriesId: any, series: any) =>
                series.color ?? colors.get(seriesId);
            return accessors;
        };

        function barChartAccessors(
            colors?: IValueProvider<string>,
            markers?: IValueProvider<IChartMarker>
        ) {
            // TODO: Refactor to accept config reference from arguments not from outer context
            // @ts-ignore: TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.;
            // An outer value of 'this' is shadowed by this container.
            const accessors = barAccessors(this.config, colors, markers);
            accessors.series.color = (
                seriesId: string,
                series: IDataSeries<IAccessors>
            ) => series.color ?? colors?.get(seriesId);
            // TODO: Remove custom accessor after fixing NUI-3688 in charts
            accessors.data.value = (d: any) =>
                Number.isFinite(d) ? d : d.value;
            return accessors;
        }

        const chartTools: Record<
            ProportionalWidgetChartTypes,
            IChartTools<IRadialAccessors> | IChartTools
        > = {
            [ProportionalWidgetChartTypes.DonutChart]: {
                preprocessor: radial,
                gridFunction: radialGrid,
                rendererFunction: () => new RadialRenderer(),
                // TODO: replace with correct type
                accessorFunction: radialChartAccessors as (
                    colors?: IValueProvider<string>,
                    markers?: IValueProvider<IChartMarker>
                ) => IAccessors,
                scaleFunction: radialScales,
            },
            [ProportionalWidgetChartTypes.PieChart]: {
                preprocessor: radial,
                gridFunction: radialGrid,
                rendererFunction: () => new PieRenderer(),
                // TODO: replace with correct type
                accessorFunction: radialChartAccessors as (
                    colors?: IValueProvider<string>,
                    markers?: IValueProvider<IChartMarker>
                ) => IAccessors,
                scaleFunction: radialScales,
            },
            [ProportionalWidgetChartTypes.HorizontalBarChart]: {
                config: { horizontal: true },
                gridFunction() {
                    return barGrid(this.config);
                },
                rendererFunction: () =>
                    new BarRenderer({
                        highlightStrategy: new BarSeriesHighlightStrategy("y"),
                    }),
                accessorFunction: barChartAccessors,
                scaleFunction() {
                    return barScales(this.config);
                },
            },
            [ProportionalWidgetChartTypes.VerticalBarChart]: {
                config: { horizontal: false },
                gridFunction() {
                    return barGrid(this.config);
                },
                rendererFunction: () =>
                    new BarRenderer({
                        highlightStrategy: new BarSeriesHighlightStrategy("x"),
                    }),
                accessorFunction: barChartAccessors,
                scaleFunction() {
                    return barScales(this.config);
                },
            },
        };

        return chartTools[chartType];
    }
}
