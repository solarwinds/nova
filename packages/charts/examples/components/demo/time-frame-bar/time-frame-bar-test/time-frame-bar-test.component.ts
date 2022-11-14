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

import { AfterContentInit, Component, OnDestroy } from "@angular/core";
import moment from "moment/moment";
import { Subscription } from "rxjs";

import {
    HistoryStorage,
    IFilter,
    IFilteringOutputs,
    ITimeframe,
    NoopDataSourceService,
} from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    getAutomaticDomainWithIncludedInterval,
    ISetDomainEventPayload,
    LineAccessors,
    LinearScale,
    LineRenderer,
    SET_DOMAIN_EVENT,
    TimeScale,
    XYGrid,
    ZoomPlugin,
} from "@nova-ui/charts";

import { TimeFrameBarDataService } from "./time-frame-bar-data.service";

@Component({
    selector: "nui-time-frame-bar-test",
    templateUrl: "./time-frame-bar-test.component.html",
    providers: [NoopDataSourceService, HistoryStorage],
})
export class TimeFrameBarTestComponent implements AfterContentInit, OnDestroy {
    public fromDate = moment("2018-05-01 15:00:00").subtract(2, "days");
    public toDate = moment("2018-05-01 15:00:00");

    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public timeFrame: ITimeframe;
    public busy: boolean;
    public addDelay: boolean = true;

    private xScale = new TimeScale("time-scale");
    private yScale = new LinearScale();
    private accessors = new LineAccessors(
        this.chartAssist.palette.standardColors,
        this.chartAssist.markers
    );
    private renderer = new LineRenderer();
    private filteringSubscription: Subscription;

    private dataService = new TimeFrameBarDataService();

    constructor(
        public history: HistoryStorage<ITimeframe>,
        private dataSourceService: NoopDataSourceService<ITimeframe>
    ) {}

    public ngAfterContentInit(): void {
        this.yScale.domainCalculator = getAutomaticDomainWithIncludedInterval([
            0, 100,
        ]);
        this.chart.addPlugins(new ZoomPlugin());

        this.filteringSubscription = this.setUpFiltering();

        this.chart
            .getEventBus()
            .getStream(SET_DOMAIN_EVENT)
            .subscribe((event) => {
                const payload = <ISetDomainEventPayload>event.data;
                const newDomain = payload[this.xScale.id];

                this.applyFilters(
                    this.history.save({
                        startDatetime: moment(newDomain[0]),
                        endDatetime: moment(newDomain[1]),
                        selectedPresetId: undefined,
                    })
                );
            });

        this.applyFilters(
            this.history.save({
                startDatetime: this.fromDate,
                endDatetime: this.toDate,
                selectedPresetId: undefined,
            })
        );
    }

    public ngOnDestroy(): void {
        if (this.filteringSubscription) {
            this.filteringSubscription.unsubscribe();
        }
    }

    public updateTimeFrame(value?: ITimeframe): void {
        this.applyFilters(this.history.restart(value));
    }

    public zoomUndo(): void {
        this.applyFilters(this.history.undo());
    }

    private applyFilters(value: ITimeframe) {
        this.busy = true;
        this.timeFrame = value;
        this.xScale.fixDomain([
            value.startDatetime.toDate(),
            value.endDatetime.toDate(),
        ]);
        this.chart.updateDimensions();
        void this.dataSourceService.applyFilters();
    }

    private setUpFiltering(): any {
        this.dataSourceService.registerComponent({
            timeframe: {
                componentInstance: {
                    getFilters: () =>
                        <IFilter<ITimeframe>>{
                            type: "ITimeframe",
                            value: this.timeFrame,
                        },
                },
            },
        });

        return this.dataSourceService.outputsSubject.subscribe(
            (data: IFilteringOutputs) => {
                const start = data.timeframe.value.startDatetime;
                const end = data.timeframe.value.endDatetime;
                this.dataService
                    .getChartData(start, end, this.addDelay ? 1000 : 0)
                    .subscribe((series) => {
                        this.chartAssist.update(
                            Object.keys(series).map((key: string) => ({
                                id: key,
                                name: key,
                                data: series[key],
                                accessors: this.accessors,
                                renderer: this.renderer,
                                scales: { x: this.xScale, y: this.yScale },
                            }))
                        );
                        this.busy = false;
                    });
            }
        );
    }
}
