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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import each from "lodash/each";
import includes from "lodash/includes";

import { LoggerService } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    HIGHLIGHT_DATA_POINT_EVENT,
    IAccessors,
    IChart,
    IChartAssistSeries,
    IChartEvent,
    InteractionType,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_SERIES_EVENT,
    INTERACTION_VALUES_EVENT,
    LineAccessors,
    LinearScale,
    LineRenderer,
    LineSelectSeriesInteractionStrategy,
    MOUSE_ACTIVE_EVENT,
    Scales,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-event-bus-test",
    templateUrl: "./chart-event-bus-test.component.html",
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartEventBusTestComponent implements OnInit {
    public parsedEvents: string[] = [];
    public eventFilters = [
        MOUSE_ACTIVE_EVENT,
        INTERACTION_VALUES_EVENT,
        INTERACTION_DATA_POINTS_EVENT,
        HIGHLIGHT_DATA_POINT_EVENT,
        INTERACTION_SERIES_EVENT,
    ];
    public interactionTypeFilters = [
        InteractionType.Click,
        InteractionType.MouseMove,
    ];
    public selectedEventFilters: string[];
    public selectedInteractionTypeFilters: InteractionType[];

    public chart: IChart;
    public chartAssist: ChartAssist;

    public isEventFilterChecked(filter: string): boolean {
        return this.selectedEventFilters.indexOf(filter) > -1;
    }

    public onEventFilterChange(filters: string[]): void {
        this.selectedEventFilters = filters;
    }

    public isInteractionTypeFilterChecked(filter: InteractionType): boolean {
        return this.selectedInteractionTypeFilters.indexOf(filter) > -1;
    }

    public onInteractionTypeFilterChange(filters: InteractionType[]): void {
        this.selectedInteractionTypeFilters = filters;
    }

    constructor(
        private logger: LoggerService,
        private changeDetector: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        const gridConfig = new XYGridConfig();
        gridConfig.cursor = "pointer";
        this.chart = new Chart(new XYGrid(gridConfig));
        this.chartAssist = new ChartAssist(this.chart);

        this.selectAllFilters();
        this.chartAssist.update(this.generateDataSeriesSet(2));

        each(this.eventFilters, (eventName) => {
            this.chart
                .getEventBus()
                .getStream(eventName)
                .subscribe((event: IChartEvent) => {
                    if (includes(this.selectedEventFilters, eventName)) {
                        if (
                            !event.data.interactionType ||
                            includes(
                                this.selectedInteractionTypeFilters,
                                event.data.interactionType
                            )
                        ) {
                            this.logger.info(
                                "EVENT:",
                                eventName,
                                "DATA:",
                                event.data
                            );
                            this.parsedEvents.unshift(
                                `Event: "${eventName}" Data: ${JSON.stringify(
                                    event.data
                                )}`
                            );
                            this.parsedEvents = this.parsedEvents.slice(0, 10);
                            this.changeDetector.markForCheck();
                        }
                    }
                });
        });
    }

    public selectAllFilters(): void {
        this.selectedEventFilters = cloneDeep(this.eventFilters);
        this.selectedInteractionTypeFilters = cloneDeep(
            this.interactionTypeFilters
        );
    }

    public deselectAllFilters(): void {
        this.selectedEventFilters = [];
        this.selectedInteractionTypeFilters = [];
    }

    private generateDataSeriesSet(
        dataSeriesCount: number
    ): IChartAssistSeries<IAccessors>[] {
        const seriesSet = DataGenerator.generateMockTimeLineSeriesSet(
            dataSeriesCount,
            40
        );
        const scales: Scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };
        const renderer = new LineRenderer({
            interactionStrategy: new LineSelectSeriesInteractionStrategy(),
        });
        const accessors = new LineAccessors();

        return seriesSet.map((dataSeries) => ({
            ...dataSeries,
            scales,
            renderer,
            accessors,
        }));
    }
}
