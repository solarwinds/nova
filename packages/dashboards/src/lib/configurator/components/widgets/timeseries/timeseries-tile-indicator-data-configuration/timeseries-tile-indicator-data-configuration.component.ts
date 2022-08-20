import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

import { ITimeseriesWidgetData } from "../../../../../components/timeseries-widget/types";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import {
    IHasChangeDetector,
    IHasForm,
    PizzagnaLayer,
} from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

@Component({
    selector: "nui-timeseries-tile-indicator-data-configuration",
    templateUrl:
        "./timeseries-tile-indicator-data-configuration.component.html",
    styleUrls: [
        "./timeseries-tile-indicator-data-configuration.component.less",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeseriesTileIndicatorDataConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnDestroy, OnChanges
{
    static lateLoadKey = "TimeseriesTileIndicatorDataConfigurationComponent";

    @Input() componentId: string;
    @Input() selectedSeriesId: string;
    @Input() allSeries: ITimeseriesWidgetData[];
    @Input() availableSeries: ITimeseriesWidgetData[];

    @Output() formReady: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    @Output() formDestroy: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();

    public set selectedSeries(value: ITimeseriesWidgetData | undefined) {
        this._selectedSeries = value;
        if (value) {
            this.form.patchValue({ id: value.id });
        }
    }

    public get selectedSeries(): ITimeseriesWidgetData | undefined {
        return this._selectedSeries;
    }

    public form: FormGroup;

    private destroy$ = new Subject();
    private _selectedSeries?: ITimeseriesWidgetData;

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        private formBuilder: FormBuilder,
        private pizzagnaService: PizzagnaService
    ) {}

    public ngOnInit() {
        this.form = this.formBuilder.group({
            id: [this.selectedSeriesId || null, [Validators.required]],
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.allSeries) {
            this.selectedSeries = this.allSeries.find(
                (s) => this.selectedSeriesId === s.id
            );
        }

        if (changes.selectedSeriesId) {
            if (!this.allSeries) {
                return;
            }
            this.selectedSeries = this.allSeries.find(
                (s) => this.selectedSeriesId === s.id
            );
        }
    }

    public onSelect(selectedSeries: ITimeseriesWidgetData) {
        this.selectedSeriesId = selectedSeries.id;
        this.selectedSeries = selectedSeries;
        this.form.patchValue({ id: selectedSeries.id });
        setTimeout(() => {
            this.pizzagnaService.setProperty(
                `${PizzagnaLayer.Data}.${this.componentId}.properties.selectedSeriesId`,
                selectedSeries.id
            );
            this.changeDetector.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.formDestroy.emit(this.form);

        this.destroy$.next();
        this.destroy$.complete();
    }
}
