import { ChangeDetectorRef, Component, Inject, Optional } from "@angular/core";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartPalette,
    IAccessors,
    IValueProvider,
    LineAccessors,
    LineRenderer,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { TimeseriesScalesService } from "../../../timeseries-scales.service";
import { XYChartComponent } from "../xy-chart.component";

@Component({
    selector: "nui-line-chart",
    templateUrl: "../xy-chart.component.html",
    styleUrls: ["../xy-chart.component.less"],
})
export class LineChartComponent extends XYChartComponent {
    public static lateLoadKey = "LineChartComponent";

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        timeseriesScalesService: TimeseriesScalesService,
        changeDetector: ChangeDetectorRef
    ) {
        super(eventBus, dataSource, timeseriesScalesService, changeDetector);

        this.renderer = new LineRenderer();
    }

    protected createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors {
        return new LineAccessors(colorProvider);
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        const gridConfig = new XYGridConfig();
        gridConfig.axis.left.fit = true;
        const chart = new Chart(new XYGrid(gridConfig));
        // @ts-ignore: Avoiding strict mode errors, keeping old flow
        return new ChartAssist(chart, null, palette);
    }
}
