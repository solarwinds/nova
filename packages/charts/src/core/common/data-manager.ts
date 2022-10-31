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

import each from "lodash/each";
import filter from "lodash/filter";
import flatten from "lodash/flatten";
import includes from "lodash/includes";
import keyBy from "lodash/keyBy";
import values from "lodash/values";

import { RenderState } from "../../renderers/types";
import { domain } from "./scales/helpers/domain";
import { IScale, ScalesIndex } from "./scales/types";
import { IAccessors, IChart, IChartSeries } from "./types";

/**
 * @ignore
 *
 * Manages data and their domains
 */
export class DataManager {
    private _chartSeriesSet: IChartSeries<IAccessors>[] = [];
    private dataIndex: { [seriesId: string]: IChartSeries<IAccessors> } = {};
    private _scalesIndexByKey: ScalesIndex = {};
    private _scalesIndexById: { [scaleId: string]: IScale<any> } = {};

    public get chartSeriesSet(): IChartSeries<IAccessors>[] {
        return this._chartSeriesSet;
    }

    public get scalesIndexByKey(): ScalesIndex {
        return this._scalesIndexByKey;
    }

    public get scalesIndexById(): { [scaleId: string]: IScale<any> } {
        return this._scalesIndexById;
    }

    constructor(private chart?: IChart) {}

    public update(seriesSet: IChartSeries<IAccessors>[]) {
        const duplicateIds = filter(
            seriesSet.map((series) => series.id),
            (val, i, iteratee) => includes(iteratee, val, i + 1)
        );
        if (duplicateIds.length > 0) {
            console.warn("Series set contains duplicate IDs:", duplicateIds);
        }

        this._chartSeriesSet = seriesSet || [];

        this.dataIndex = keyBy(
            this._chartSeriesSet,
            (s: IChartSeries<IAccessors>) => s.id
        );
        this._scalesIndexByKey = this.buildScalesIndex(this._chartSeriesSet);
        this._scalesIndexById = keyBy(
            flatten(values(this._scalesIndexByKey).map((v) => v.list)),
            (s) => s.id
        );
    }

    public getChartSeries(seriesId: string) {
        return this.dataIndex[seriesId];
    }

    private updateScaleDomain(scale: IScale<any>, scaleKey: string) {
        if (scale.isDomainFixed) {
            return;
        }

        if (scale.domainCalculator) {
            const chartSeriesSet = this.chartSeriesSet
                .filter(
                    (cs) =>
                        cs.scales[scaleKey] === scale &&
                        !cs.renderer.config.ignoreForDomainCalculation
                )
                .filter((c) => c.renderState !== RenderState.hidden);
            if (
                chartSeriesSet.length ||
                this.chart?.configuration?.updateDomainForEmptySeries
            ) {
                const calculatedDomain = scale.domainCalculator(
                    chartSeriesSet,
                    scaleKey,
                    scale
                );
                domain(scale, calculatedDomain);
            }
        }
    }

    private buildScalesIndex(
        chartSeries: IChartSeries<IAccessors>[]
    ): ScalesIndex {
        const scales: ScalesIndex = {};
        each(chartSeries, (cs) => {
            each(Object.keys(cs.scales), (scaleKey) => {
                const scale = cs.scales[scaleKey];
                let indexEntry = scales[scaleKey];
                if (!indexEntry) {
                    indexEntry = {
                        index: {},
                        list: [],
                    };
                    scales[scaleKey] = indexEntry;
                }
                if (!indexEntry.index[scale.id]) {
                    indexEntry.index[scale.id] = scale;
                    indexEntry.list.push(scale);
                }
            });
        });
        return scales;
    }

    public updateScaleDomains() {
        each(Object.keys(this._scalesIndexByKey), (scaleKey) => {
            each(this._scalesIndexByKey[scaleKey].list, (scale) => {
                this.updateScaleDomain(scale, scaleKey);
            });
        });
    }
}
