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
import findKey from "lodash/findKey";
import isUndefined from "lodash/isUndefined";
import { Observable, Subscription } from "rxjs";

import {
    DESTROY_EVENT,
    INTERACTION_COORDINATES_EVENT,
    INTERACTION_VALUES_EVENT,
    MOUSE_ACTIVE_EVENT,
    REFRESH_EVENT,
} from "../constants";
import { EventBus } from "./common/event-bus";
import { IChart, IChartCollectionEvent, IChartEvent } from "./common/types";

/**
 * @ignore
 *
 * Chart collection takes care of charts grouping and rebroadcasting selected events coming from one charts to other charts
 */
export class ChartCollection {
    public lastIndex = -1;

    /**
     * These events will be rebroadcasted to other charts in the collection
     *
     * @type {[string]}
     */
    public events = [
        INTERACTION_VALUES_EVENT,
        INTERACTION_COORDINATES_EVENT,
        MOUSE_ACTIVE_EVENT,
        REFRESH_EVENT,
    ];

    private charts: { [key: string]: IChart } = {};
    private subscriptions: { [key: string]: Subscription[] } = {};
    private eventBus?: EventBus<IChartCollectionEvent>;

    constructor() {}

    /**
     * Register chart in this collection and subscribe to all configured events
     *
     * @param {IChart} chart
     */
    public addChart(chart: IChart) {
        const index = (++this.lastIndex).toString();

        this.charts[index] = chart;

        if (!this.eventBus) {
            this.initializeEventBus();
        }

        each(this.events, (event) => {
            this.subscribe(
                index,
                chart.getEventBus().getStream(event),
                (value: IChartEvent) => {
                    // this is where we check for the __broadcast__ flag, which means it originated in the chart collection
                    if (!value.broadcast) {
                        this.eventBus
                            ?.getStream(event)
                            .next({ chartIndex: index, event: value });
                    }
                }
            );
        });

        this.subscribe(
            index,
            chart.getEventBus().getStream(DESTROY_EVENT),
            (value: any) => {
                this.removeChart(chart);

                if (Object.keys(this.charts).length === 0) {
                    this.destroy();
                }
            }
        );
    }

    /**
     * Removed chart from the collection and unsubscribes all related subscriptions
     *
     * @param {IChart} chart
     */
    public removeChart(chart: IChart) {
        const key = this.getChartKey(chart);
        if (isUndefined(key)) {
            throw new Error("Chart not registered!");
        }

        this.unsubscribeChart(key);
        delete this.charts[key];
    }

    /**
     * Destroy this collection and release related resources
     */
    public destroy() {
        this.eventBus?.destroy();
        this.eventBus = undefined;
    }

    private initializeEventBus() {
        this.eventBus = new EventBus<IChartCollectionEvent>();

        for (const event of this.events) {
            this.eventBus
                .getStream(event)
                .subscribe((e: IChartCollectionEvent) => {
                    for (const i of Object.keys(this.charts)) {
                        if (i !== e.chartIndex) {
                            // setting this flag prevents the event from looping infinitely
                            e.event.broadcast = true;
                            this.charts[i]
                                .getEventBus()
                                .getStream(event)
                                .next(e.event);
                        }
                    }
                });
        }
    }

    /**
     * Register subscription for given chart key on given observable
     *
     * @param {string} chartKey
     * @param {Observable<any>} observable
     * @param {(value: any) => void} next
     */
    private subscribe(
        chartKey: string,
        observable: Observable<any>,
        next: (value: any) => void
    ) {
        const sub = observable.subscribe(next);

        let chartSubscriptions = this.subscriptions[chartKey];
        if (isUndefined(chartSubscriptions)) {
            chartSubscriptions = [];
            this.subscriptions[chartKey] = chartSubscriptions;
        }
        chartSubscriptions.push(sub);
    }

    /**
     * Unsubscribes subscriptions that belong to given chart key
     *
     * @param {string} chartKey
     */
    private unsubscribeChart(chartKey: string) {
        each(this.subscriptions[chartKey], (sub) => {
            sub.unsubscribe();
        });
        delete this.subscriptions[chartKey];
    }

    private getChartKey(chart: IChart): string | undefined {
        return findKey(this.charts, (c: IChart) => c === chart);
    }
}
