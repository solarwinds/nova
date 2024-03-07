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
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    BarTooltipsPlugin,
    Chart,
    ChartAssist,
    ChartPalette,
    IAccessors,
    IChartAssistSeries,
    InteractionLabelPlugin,
    IValueProvider,
    IXYScales,
    TimeIntervalScale,
} from "@nova-ui/charts";

import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { CartesianScalesService } from "../../../services/cartesian-scales.service";
import { XYChartComponent } from "../xy-chart.component";

@Component({
    selector: "nui-stacked-bar-chart",
    templateUrl: "../xy-chart.component.html",
    styleUrls: ["../xy-chart.component.less"],
})
export class BarChartComponent extends XYChartComponent {
    public static lateLoadKey = "CartesianBarChartComponent";
    private tooltipsPlugin = new BarTooltipsPlugin();
    private labelPlugin = new InteractionLabelPlugin();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        cartesianScalesService: CartesianScalesService,
        changeDetector: ChangeDetectorRef
    ) {
        super(eventBus, dataSource, cartesianScalesService, changeDetector);

        this.valueAccessorKey = "value";
    }

    public mapSeriesSet(
        data: any[],
        scales: IXYScales
    ): IChartAssistSeries<IAccessors>[] {
        if (
            scales.x instanceof TimeIntervalScale ||
            scales.x instanceof BandScale
        ) {
            // @ts-ignore
            this.accessors.data.thickness = undefined; // allow the renderer to calculate thickness
        } else {
            // @ts-ignore
            this.accessors.data.thickness = () => BarRenderer.THICK; // arbitrary constant value
        }

        return super.mapSeriesSet(data, scales);
    }

    protected createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors {
        const accessors = barAccessors({ horizontal: false, grouped: true }, colorProvider);
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        return accessors;
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        // disable pointer events on bars to ensure the zoom drag target is the mouse interactive area rather than the bars
        this.renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
            pointerEvents: false,
        });

        const chart = new Chart(barGrid({ horizontal: false, grouped: true }));
        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(this.labelPlugin);
        chart.addPlugin(this.tooltipsPlugin);
        return new ChartAssist(chart, undefined, palette);
    }
}
