import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";

import { IHasChangeDetector } from "../../types";

import { TimeseriesChartPresetService } from "./timeseries-chart-preset.service";
import { IChartPreset, ITimeseriesOutput, ITimeseriesWidgetConfig, TimeseriesChartPreset } from "./types";

/** @ignore */
@Component({
    selector: "nui-timeseries-widget",
    templateUrl: "./timeseries-widget.component.html",
})
export class TimeseriesWidgetComponent implements OnChanges, IHasChangeDetector {
    public static lateLoadKey = "TimeseriesWidgetComponent";

    @Input() public widgetData: ITimeseriesOutput = {} as ITimeseriesOutput;
    @Input() public configuration: ITimeseriesWidgetConfig = {} as ITimeseriesWidgetConfig;
    @Input() @HostBinding("class") public elementClass = "";

    public chartPreset: IChartPreset;

    constructor(public timeseriesChartPresetService: TimeseriesChartPresetService,
        public changeDetector: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.configuration) {
            const configurationCurrent: ITimeseriesWidgetConfig = changes.configuration.currentValue;
            const configurationPrevious: ITimeseriesWidgetConfig = changes.configuration.previousValue;

            if (configurationCurrent?.preset !== configurationPrevious?.preset) {
                this.chartPreset = this.timeseriesChartPresetService.presets[this.configuration?.preset ?? TimeseriesChartPreset.Line];
            }
        }
    }

    /** Checks if chart should be shown. */
    public shouldShowChart(): boolean {
        return this.widgetData?.series?.length > 0;
    }

}
