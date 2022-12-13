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

import { ChangeDetectorRef, Component, Inject, Optional } from "@angular/core";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    areaGrid,
    AreaRenderer,
    Chart,
    ChartAssist,
    ChartPalette,
    IAccessors,
    IValueProvider,
    stackedArea,
    stackedAreaAccessors,
} from "@nova-ui/charts";

import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { TimeseriesScalesService } from "../../../timeseries-scales.service";
import { XYChartComponent } from "../xy-chart.component";

@Component({
    selector: "nui-stacked-area-chart",
    templateUrl: "../xy-chart.component.html",
    styleUrls: ["../xy-chart.component.less"],
})
export class StackedAreaChartComponent extends XYChartComponent {
    public static lateLoadKey = "StackedAreaChartComponent";

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        timeseriesScalesService: TimeseriesScalesService,
        changeDetector: ChangeDetectorRef
    ) {
        super(eventBus, dataSource, timeseriesScalesService, changeDetector);

        this.renderer = new AreaRenderer();
        this.valueAccessorKey = "y1";
    }

    protected createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors {
        return stackedAreaAccessors(colorProvider);
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        const grid = areaGrid();
        const gridConfig = grid.config();
        gridConfig.axis.left.fit = true;
        const chart = new Chart(grid);

        if (this.configuration.gridConfig?.hideYAxisTicksLabels) {
            gridConfig.axis.left.visible = false;
            gridConfig.axis.right.visible = false;
        }

        return new ChartAssist(chart, stackedArea, palette);
    }
}
