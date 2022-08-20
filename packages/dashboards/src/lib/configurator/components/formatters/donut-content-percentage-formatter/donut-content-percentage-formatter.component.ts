import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import {
    ChartAssist,
    IAccessors,
    IChartAssistEvent,
    IChartAssistSeries,
} from "@nova-ui/charts";
import sumBy from "lodash/sumBy";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IProperties } from "../../../../types";

@Component({
    template: `<ng-container>
        <div class="nui-text-page">
            <div class="nui-text-page">
                {{ chartContent }}
            </div>
        </div>
    </ng-container>`,
})
export class DonutContentPercentageFormatterComponent
    implements OnChanges, OnInit
{
    static lateLoadKey = "DonutContentPercentageFormatterComponent";

    public sum: number;
    public emphasizedSeriesData: IChartAssistSeries<IAccessors> | undefined;
    public currentMetricData: number | undefined;
    public chartContent: string;

    private destroy$: Subject<any> = new Subject();

    constructor(public changeDetector: ChangeDetectorRef) {}

    @Input() data: IChartAssistSeries<IAccessors>[];
    @Input() chartAssist: ChartAssist;
    @Input() properties: IProperties;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.sum = sumBy(this.data, (s) => s.data[0]);
        }

        if (changes.properties) {
            // If current metric is not in the list of metrics any more we fall back to the very first one from the list we get from the datasource
            this.currentMetricData =
                this.data.find(
                    (item) => item.id === this.properties?.currentMetric
                )?.data[0] || this.data[0].data[0];
        }

        this.getProperContentValue();
    }

    ngOnInit(): void {
        this.chartAssist.chartAssistSubject
            .pipe(
                tap(
                    (data: IChartAssistEvent) =>
                        (this.emphasizedSeriesData = this.data.find(
                            (item) => item.id === data.payload.seriesId
                        ))
                ),
                tap(() => this.getProperContentValue()),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public getProperSeriesData(): number {
        return this.emphasizedSeriesData
            ? this.emphasizedSeriesData?.data[0]
            : this.currentMetricData;
    }

    public getProperContentValue(): void {
        this.chartContent =
            ((this.getProperSeriesData() / this.sum) * 100).toFixed(2) + "%";
    }
}
