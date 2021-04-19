import { ChangeDetectorRef, Component, Inject, Optional } from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    ChartAssist,
    ChartPalette,
    IAccessors,
    IChartAssistSeries,
    InteractionLabelPlugin,
    IValueProvider,
    IXYScales,
    stack,
    TimeIntervalScale
} from "@nova-ui/charts";

import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { TimeseriesScalesService } from "../../../timeseries-scales.service";
import { XYChartComponent } from "../xy-chart.component";

@Component({
    selector: "nui-stacked-bar-chart",
    templateUrl: "../xy-chart.component.html",
    styleUrls: ["../xy-chart.component.less"],
})
export class StackedBarChartComponent extends XYChartComponent {
    public static lateLoadKey = "StackedBarChartComponent";

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
                timeseriesScalesService: TimeseriesScalesService,
                changeDetector: ChangeDetectorRef) {
        super(eventBus, dataSource, timeseriesScalesService, changeDetector);

        this.valueAccessorKey = "value";
        // disable pointer events on bars to ensure the zoom drag target is the mouse interactive area rather than the bars
        this.renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x"), pointerEvents: false });
    }

    public mapSeriesSet(data: any[], scales: IXYScales): IChartAssistSeries<IAccessors>[] {
        if (scales.x instanceof TimeIntervalScale) {
            // @ts-ignore
            this.accessors.data.thickness = undefined; // allow the renderer to calculate thickness
        } else {
            // @ts-ignore
            this.accessors.data.thickness = () => 5; // arbitrary constant value
        }

        return super.mapSeriesSet(data, scales);
    }

    protected createAccessors(colorProvider: IValueProvider<string>): IAccessors {
        const accessors = barAccessors({ horizontal: false }, colorProvider);
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        return accessors;
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        const chart = new Chart(barGrid());
        chart.addPlugin(new InteractionLabelPlugin());
        return new ChartAssist(chart, stack, palette);
    }

}
