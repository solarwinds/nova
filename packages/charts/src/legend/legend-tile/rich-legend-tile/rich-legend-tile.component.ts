import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Host,
    Input,
    Optional,
    ViewEncapsulation,
} from "@angular/core";
import _isNil from "lodash/isNil";

import { LegendSeriesComponent } from "../../legend-series/legend-series.component";
import { LegendComponent } from "../../legend.component";

@Component({
    selector: "nui-rich-legend-tile",
    templateUrl: "./rich-legend-tile.component.html",
    styleUrls: ["./rich-legend-tile.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
})
export class RichLegendTileComponent implements AfterContentInit, AfterViewInit {
    /**
     * The series unit label
     */
    @Input() public unitLabel: string;

    /**
     * The current value of the series
     */
    @Input() public value: string;

    /**
     * The series color
     */
    @Input() public backgroundColor: string;

    /**
     * Color for the text
     */
    @Input() public color: string;

    public seriesHasAdditionalContent: boolean;

    constructor(@Host() private legendSeries: LegendSeriesComponent,
                @Optional() @Host() private legend: LegendComponent,
                private changeDetector: ChangeDetectorRef) { }

    public ngAfterContentInit() {
        if (this.legend) {
            this.unitLabel = this.unitLabel || this.legend.seriesUnitLabel;
            this.backgroundColor = this.backgroundColor || this.legend.seriesColor || "white";
        }
    }

    public ngAfterViewInit() {
        if (this.legendSeries) {
            this.seriesHasAdditionalContent = this.legendSeries.hasInputDescription() || this.legendSeries.hasProjectedDescription();
            this.changeDetector.detectChanges();
        }
    }

    public hasInputValue() {
        return !_isNil(this.value);
    }

    public hasInputUnitLabel() {
        return !_isNil(this.unitLabel);
    }
}
