import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { EventBus, IEvent, uuid } from "@nova-ui/bits";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { ITimeseriesWidgetData } from "../../../../../components/timeseries-widget/types";
import { IPizzagnaProperty } from "../../../../../pizzagna/functions/get-pizzagna-property-path";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IHasChangeDetector, IHasForm, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../../types";
import { ITimeseriesItemConfiguration } from "../types";

@Component({
    selector: "nui-timeseries-series-collection-configuration",
    templateUrl: "timeseries-series-collection-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeseriesSeriesCollectionConfigurationComponent implements IHasChangeDetector, IHasForm, OnDestroy, OnChanges {
    static lateLoadKey = "TimeseriesSeriesCollectionConfigurationComponent";

    @Input() nodes: string[];
    @Input() componentId: string;
    @Input() series: ITimeseriesItemConfiguration[] = [];
    @Input() availableSeries: ITimeseriesWidgetData[];
    @Input() allSeries: ITimeseriesWidgetData[];

    @Output() formReady = new EventEmitter();

    public form: FormGroup;
    public emptySeries$: Observable<boolean>;

    private destroy$ = new Subject();

    constructor(public pizzagnaService: PizzagnaService,
                public changeDetector: ChangeDetectorRef,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.allSeries && !changes.allSeries.isFirstChange()) {
            // if we receive 'allSeries' data from the data source after component initialization, we
            // re-create the series config components to make them aware of this change
            this.createSeriesConfigComponents(this.series);
            setTimeout(() => this.changeDetector.markForCheck());
        }
    }

    public onFormReady(form: AbstractControl) {
        this.form = form as FormGroup;
        this.formReady.emit(form);
        this.emptySeries$ = this.form.valueChanges.pipe(map(result => result.length === 0));
    }

    public onItemsChange(series: ITimeseriesItemConfiguration[]) {
        this.createSeriesConfigComponents(series);

        const property: IPizzagnaProperty = {
            componentId: this.componentId,
            pizzagnaKey: PizzagnaLayer.Data,
            propertyPath: ["series"],
        };
        this.pizzagnaService.setProperty(property, series);
    }

    public isPossibleToAddSeries() {
        const total = this.allSeries && this.allSeries.length;
        const present = this.series && this.series.length;

        return total > present;
    }

    public addSeries() {
        // @ts-ignore: Types of property 'selectedSeriesId' are incompatible.
        this.onItemsChange([
            ...this.series,
            {
                id: uuid("series"),
                // TODO: Provide selectedSeriesId value that corresponds to it's type which is string
                selectedSeriesId: null,
            },
        ]);
    }

    private createSeriesConfigComponents(series: ITimeseriesItemConfiguration[]) {
        const parentPath = "series";
        const componentIds = series.map(tile => tile.id);
        this.pizzagnaService.createComponentsFromTemplate(parentPath, componentIds);
    }
}
