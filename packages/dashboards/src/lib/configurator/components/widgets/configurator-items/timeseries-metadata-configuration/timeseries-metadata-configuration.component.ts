import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventBus, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { TimeseriesChartPreset } from "../../../../../components/timeseries-widget/types";
import { LegendPlacement } from "../../../../../components/types";
import { PREVIEW_EVENT, REFRESH } from "../../../../../services/types";
import { IHasChangeDetector, IHasForm, PIZZAGNA_EVENT_BUS } from "../../../../../types";

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
export class TimeseriesMetadataConfigurationComponent implements IHasChangeDetector, IHasForm, OnInit, OnChanges, OnDestroy {
    static lateLoadKey = "TimeseriesMetadataConfigurationComponent";

    @Input() legendPlacements: LegendPlacement[] = [];
    @Input() timeSpans: ITimeSpanOption[] = [];
    @Input() startingTimespan: any;
    @Input() legendPlacement: LegendPlacement;
    @Input() leftAxisLabel: string;
    @Input() preset: TimeseriesChartPreset;
    @Input() availableChartTypes: ITimeseriesChartTypeOption[] = [
        {label: $localize`Line`, value: TimeseriesChartPreset.Line},
        {label: $localize`Stacked area`, value: TimeseriesChartPreset.StackedArea},
        {label: $localize`Stacked % area`, value: TimeseriesChartPreset.StackedPercentageArea},
        {label: $localize`Bar`, value: TimeseriesChartPreset.StackedBar},
        {label: $localize`Status`, value: TimeseriesChartPreset.StatusBar},
    ];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    private destroy$ = new Subject();

    constructor(public changeDetector: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
        this.form = this.formBuilder.group({
            leftAxisLabel: [""],
            startingTimespan: [null, Validators.required],
            legendPlacement: [LegendPlacement.None, [Validators.required]],
            preset: [TimeseriesChartPreset.Line, [Validators.required]],
        });
    }

    public ngOnInit(): void {
        this.form.get("startingTimespan")?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                // this is to wait until the value of 'startingTimespan' is converted to the preview
                setTimeout(() => {
                    this.eventBus.next(PREVIEW_EVENT, {payload: {id: REFRESH}});
                });
            });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const startingTimespanControl = this.form.get("startingTimespan");

        if (changes.leftAxisLabel && !changes.leftAxisLabel.isFirstChange()) {
            this.form.get("leftAxisLabel")?.setValue(this.leftAxisLabel, {emitEvent: false});
        }

        if (changes.startingTimespan && !changes.startingTimespan.isFirstChange()) {
            startingTimespanControl?.setValue(this.startingTimespan, {emitEvent: false});
        }

        if (changes.legendPlacement && !changes.legendPlacement.isFirstChange()) {
            this.form.get("legendPlacement")?.setValue(this.legendPlacement, {emitEvent: false});
        }

        if (changes.preset && !changes.preset.isFirstChange()) {
            this.form.get("preset")?.setValue(this.preset, {emitEvent: false});
        }

        if (changes.timeSpans) {
            if (!startingTimespanControl?.value && this.timeSpans?.length > 0) {
                startingTimespanControl?.setValue(this.timeSpans[0]);
            }
        }
    }

    public getSecondaryText() {
        const startingTimespan = this.form.controls["startingTimespan"].value;
        const forTimeframe = (startingTimespan && startingTimespan.name) || $localize`No timespan`;
        const forLegend = this.form.controls["legendPlacement"].value || $localize`No legend`;
        const forAxisLabel = this.form.controls["leftAxisLabel"].value || $localize`No y-axis label`;
        return `${forTimeframe}, ${forLegend}, ${forAxisLabel}`;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
