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

import defaultsDeep from "lodash/defaultsDeep";
import pickBy from "lodash/pickBy";
import values from "lodash/values";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IElementPosition } from "./types";
import {
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_DATA_POINT_EVENT,
} from "../../constants";
import { ChartPlugin } from "../common/chart-plugin";
import {
    IChartEvent,
    IDataPoint,
    IDataPointsPayload,
    InteractionType,
} from "../common/types";

/** Configuration for the popover plugin */
export interface IPopoverPluginConfig {
    /** ID of the event stream the plugin will respond to */
    eventStreamId?:
        | typeof INTERACTION_DATA_POINTS_EVENT
        | typeof INTERACTION_DATA_POINT_EVENT;
    /** The type of interaction that will trigger the showing and hiding of the popovers */
    interactionType?: InteractionType;
}

/**
 * This plugin listens for the INTERACTION_DATA_POINTS_EVENT by default and transforms received data into
 * popover inputs. The listened event can be configured using the 'config.eventStreamId' property.
 * The actual popover is handled by the ChartPopoverComponent.
 */
export class ChartPopoverPlugin extends ChartPlugin {
    /** Info about the data point(s) received in the most recent interaction event */
    public dataPoints: IDataPointsPayload;
    /** Emits the popover's target position */
    public updatePositionSubject = new Subject<IElementPosition>();
    /** Emits an event indicating the popover should open */
    public openPopoverSubject = new Subject<void>();
    /** Emits an event indicating the popover should close */
    public closePopoverSubject = new Subject<void>();
    /** The target position of the popover */
    public popoverTargetPosition: IElementPosition = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    };
    /** The default plugin configuration */
    public DEFAULT_CONFIG: IPopoverPluginConfig = {
        eventStreamId: INTERACTION_DATA_POINTS_EVENT,
        interactionType: InteractionType.MouseMove,
    };

    private isOpen = false;
    private readonly destroy$ = new Subject<void>();

    constructor(public config: IPopoverPluginConfig = {}) {
        super();
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public initialize(): void {
        this.chart
            .getEventBus()
            .getStream(this.config.eventStreamId as string)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                if (
                    event.data.interactionType === this.config.interactionType
                ) {
                    // here we handle data either of type IInteractionDataPointsEvent or IInteractionDataPointEvent
                    const dataPoints: IDataPointsPayload = event.data
                        .dataPoints ?? {
                        [event.data.dataPoint.seriesId]: event.data.dataPoint,
                    };
                    this.processDataPoints(dataPoints);
                }
            });
    }

    public destroy(): void {
        if (this.updatePositionSubject) {
            this.updatePositionSubject.complete();
        }
        if (this.openPopoverSubject) {
            this.openPopoverSubject.complete();
        }
        if (this.closePopoverSubject) {
            this.closePopoverSubject.complete();
        }
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
    }

    protected getAbsolutePosition(valuesArray: any[]): IElementPosition {
        const chartElement: any = this.chart.target?.node()?.parentNode; // the one above svg

        if (!chartElement) {
            throw new Error("Chart parent node is not defined");
        }

        const dataPointsLeft = Math.min(
            ...valuesArray.map((d) => d.position.x)
        );
        const left =
            chartElement.offsetLeft +
            this.chart.getGrid().config().dimension.margin.left +
            dataPointsLeft;
        const top =
            chartElement.offsetTop +
            this.chart.getGrid().config().dimension.margin.top;
        // area for popovers is enlarged to cover the whole chart (top to bottom),
        // so that we avoid collision of chart visualization and popover (by UX request)
        return {
            top: top,
            left: left,
            height: chartElement.offsetHeight,
            width:
                Math.max(
                    ...valuesArray.map(
                        (d) => d.position.x + (d.position.width || 0)
                    )
                ) - dataPointsLeft,
        };
    }

    private processDataPoints(dataPoints: IDataPointsPayload) {
        const validDataPoints = pickBy(
            dataPoints,
            (d: IDataPoint) => d.index >= 0 && d.position
        );
        const validDataPointsValues = values(validDataPoints);
        if (validDataPointsValues.length > 0) {
            this.popoverTargetPosition = this.getAbsolutePosition(
                validDataPointsValues
            );
            this.dataPoints = validDataPoints;
            // timeout is needed in order to successfully open popover on initial hover over the chart
            setTimeout(() => {
                this.updatePositionSubject.next(this.popoverTargetPosition);
                if (!this.isOpen) {
                    this.isOpen = true;
                    this.openPopoverSubject.next();
                }
            });
        } else {
            // timeout is needed for symmetry of timing with above timeout for opening the popover
            setTimeout(() => {
                this.closePopoverSubject.next();
                this.isOpen = false;
            });
        }
    }
}
