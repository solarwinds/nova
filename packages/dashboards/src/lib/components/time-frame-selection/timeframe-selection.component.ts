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
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Optional,
    SimpleChanges,
} from "@angular/core";
import moment, { Moment } from "moment/moment";

import {
    EventBus,
    HistoryStorage,
    IDataSource,
    IEvent,
    IFilter,
    ITimeframe,
    TimeframeService,
} from "@nova-ui/bits";

import { TimeframeSerializationService } from "../../configurator/services/timeframe-serialization.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { REFRESH, SET_TIMEFRAME } from "../../services/types";
import {
    DATA_SOURCE,
    IHasChangeDetector,
    ISerializableTimeframe,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../types";

@Component({
    selector: "nui-timeframe-selection",
    templateUrl: "./timeframe-selection.component.html",
    styleUrls: ["./timeframe-selection.component.less"],
    providers: [HistoryStorage],
    standalone: false,
})
export class TimeframeSelectionComponent
    implements OnChanges, OnInit, IHasChangeDetector
{
    public static lateLoadKey = "TimeframeSelectionComponent";

    public currentTimeframe: ITimeframe;
    public minDateAsMoment: Moment;
    public maxDateAsMoment: Moment;

    @Input() public componentId: string;
    @Input() public minDate: string;
    @Input() public maxDate: string;
    @Input() public timeframe: ISerializableTimeframe;

    @HostBinding("class") public elementClass: string;

    constructor(
        private pizzagnaService: PizzagnaService,
        public timeframeService: TimeframeService,
        private tfSerialization: TimeframeSerializationService,
        public history: HistoryStorage<ITimeframe>,
        @Optional() @Inject(DATA_SOURCE) private dataSource: IDataSource,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        public changeDetector: ChangeDetectorRef
    ) {
        // just setting the timeframe to some reasonable default value
        this.currentTimeframe =
            this.timeframeService.getTimeframeByPresetId("last7Days");
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeframe) {
            let timeframe = this.tfSerialization.convertFromSerializable(
                this.timeframe
            );
            timeframe = this.timeframeService.reconcileTimeframe(timeframe);
            if (timeframe.selectedPresetId) {
                // populate the title
                timeframe = this.timeframeService.getTimeframeByPresetId(
                    timeframe.selectedPresetId
                );
            }
            this.currentTimeframe = timeframe;
            if (!changes.timeframe.isFirstChange()) {
                this.eventBus.getStream(REFRESH).next({});
            }
        }

        if (changes.minDate) {
            this.minDateAsMoment = moment(this.minDate, moment.defaultFormat);
        }

        if (changes.maxDate) {
            this.maxDateAsMoment = moment(this.maxDate, moment.defaultFormat);
        }
    }

    public ngOnInit(): void {
        this.history.restart(this.currentTimeframe);
        this.eventBus.getStream(SET_TIMEFRAME).subscribe((event) => {
            if (!event.payload) {
                throw new Error(
                    "Unable to set timeframe. Event payload is undefined"
                );
            }
            this.onTimeframeChange(
                this.history.save(
                    this.tfSerialization.convertFromSerializable(event.payload)
                )
            );
        });

        if (this.dataSource) {
            this.dataSource.registerComponent({
                timeframe: {
                    componentInstance: {
                        getFilters: () => {
                            const timeframe =
                                this.timeframeService.reconcileTimeframe(
                                    this.currentTimeframe
                                );
                            return <IFilter<ITimeframe>>{
                                type: "timeframe",
                                value: timeframe,
                            };
                        },
                    },
                },
            });
        }
    }

    public onTimeframeChange(timeframe: ITimeframe): void {
        const newTimeframe =
            this.timeframeService.reconcileTimeframe(timeframe);

        // replace undefined preset value with empty string to explicitly override any value on the pizzagna's config layer
        newTimeframe.selectedPresetId = newTimeframe.selectedPresetId || "";

        if (
            !this.timeframeService.isEqual(newTimeframe, this.currentTimeframe)
        ) {
            this.pizzagnaService.setProperty(
                {
                    pizzagnaKey: PizzagnaLayer.Data,
                    componentId: this.componentId,
                    propertyPath: ["timeframe"],
                },
                this.tfSerialization.convertToSerializable(newTimeframe)
            );
        }
    }
}
