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
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { TimeseriesChartPreset } from "../../../../../components/timeseries-widget/types";
import { PREVIEW_EVENT, REFRESH } from "../../../../../services/types";
import {
    IHasChangeDetector,
    IHasForm,
    PIZZAGNA_EVENT_BUS,
} from "../../../../../types";
import { LegendPlacement } from "../../../../../widget-types/common/widget/legend";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

export interface ITimeseriesChartTypeOption {
    label: string;
    value: TimeseriesChartPreset;
}

export interface ITimeSpanOption {
    id: string;
    name: string;
}

@Component({
    selector: "nui-timeseries-metadata-configuration",
    templateUrl: "./timeseries-metadata-configuration.component.html",
    styleUrls: ["./timeseries-metadata-configuration.component.less"],
})
export class TimeseriesMetadataConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnChanges, OnDestroy
{
    static lateLoadKey = "TimeseriesMetadataConfigurationComponent";

    @Input() legendPlacements: LegendPlacement[] = [];
    @Input() timeSpans: ITimeSpanOption[] = [];
    @Input() startingTimespan: any;
    @Input() legendPlacement: LegendPlacement;
    @Input() leftAxisLabel: string;
    @Input() preset: TimeseriesChartPreset;
    @Input() availableChartTypes: ITimeseriesChartTypeOption[] = [
        { label: $localize`Line`, value: TimeseriesChartPreset.Line },
        {
            label: $localize`Stacked area`,
            value: TimeseriesChartPreset.StackedArea,
        },
        {
            label: $localize`Stacked % area`,
            value: TimeseriesChartPreset.StackedPercentageArea,
        },
        { label: $localize`Bar`, value: TimeseriesChartPreset.StackedBar },
        { label: $localize`Status`, value: TimeseriesChartPreset.StatusBar },
    ];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    private destroy$ = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        private formBuilder: FormBuilder,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {
        this.form = this.formBuilder.group({
            leftAxisLabel: [""],
            startingTimespan: [null, Validators.required],
            legendPlacement: [LegendPlacement.None, [Validators.required]],
            preset: [TimeseriesChartPreset.Line, [Validators.required]],
        });
    }

    public ngOnInit(): void {
        this.form
            .get("startingTimespan")
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                // this is to wait until the value of 'startingTimespan' is converted to the preview
                setTimeout(() => {
                    this.eventBus.next(PREVIEW_EVENT, {
                        payload: { id: REFRESH },
                    });
                });
            });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const startingTimespanControl = this.form.get("startingTimespan");

        if (changes.leftAxisLabel) {
            this.form
                .get("leftAxisLabel")
                ?.setValue(this.leftAxisLabel, { emitEvent: false });
        }

        if (changes.startingTimespan) {
            startingTimespanControl?.setValue(this.startingTimespan, {
                emitEvent: false,
            });
        }

        if (changes.legendPlacement) {
            this.form
                .get("legendPlacement")
                ?.setValue(this.legendPlacement, { emitEvent: false });
        }

        if (changes.preset) {
            this.form
                .get("preset")
                ?.setValue(this.preset, { emitEvent: false });
        }

        if (changes.timeSpans) {
            if (!startingTimespanControl?.value && this.timeSpans?.length > 0) {
                startingTimespanControl?.setValue(this.timeSpans[0]);
            }
        }
    }

    public getSecondaryText() {
        const startingTimespan = this.form.controls["startingTimespan"].value;
        const forTimeframe =
            (startingTimespan && startingTimespan.name) ||
            $localize`No timespan`;
        const forLegend =
            this.form.controls["legendPlacement"].value || $localize`No legend`;
        const forAxisLabel =
            this.form.controls["leftAxisLabel"].value ||
            $localize`No y-axis label`;
        return `${forTimeframe}, ${forLegend}, ${forAxisLabel}`;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
