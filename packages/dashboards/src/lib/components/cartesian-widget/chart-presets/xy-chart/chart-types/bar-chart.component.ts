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

import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    Optional
} from "@angular/core";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    BarTooltipsPlugin,
    Chart,
    ChartAssist,
    ChartPalette,
    IAccessors,
    IBarChartConfig,
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
    selector: "nui-bar-chart",
    template: `   <div class="nui-chart-layout">
        <div class="chart">
            <nui-chart class="w-100" [chart]="chartAssist.chart"></nui-chart>
        </div>
    </div>
    `,
    styleUrls: ["../xy-chart.component.less"],
})
export class BarChartComponent {
    public static lateLoadKey = "CartesianBarChartComponent";
    @Input()widgetData: any
    public chartAssist: ChartAssist;
    public scales: any;
    public renderer: any;
    public accessors: any;
    public tooltipsPlugin = new BarTooltipsPlugin();
    public config = { grouped: true, horizontal: false } as IBarChartConfig;

    ngOnInit() {
        const chart = new Chart(barGrid(this.config));
        this.chartAssist = new ChartAssist(chart);

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());
        chart.addPlugin(this.tooltipsPlugin);

        // 1. Call the convenience function to create bar chart scales. Like this:
        this.scales = barScales(this.config);

        this.renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        // 2. Make your category accessor to return the value like [ category, subCategory ]
        this.accessors = barAccessors(this.config);
        this.accessors.data.category = (
            data: any,
            i: any,
            series: any,
            dataSeries: any
        ) => [data.name, dataSeries.name];

        this.chartAssist.update(
            this.widgetData.series.map((e: any)=>{
                console.log(e)
                return { id: e.id,
                    name: e.id,
                    data: e.data
                };
            }).map((s: any) => {
console.log(s)
                return {
                    ...s,
                    accessors: this.accessors,
                    renderer: this.renderer,
                    scales: this.scales,
                };
            })
        );
    }
    ngOnChanges(c: any){
        console.log(c)
        // this.chartAssist.update(
        //     this.widgetData.map((s: any) => ({
        //         ...s,
        //         accessors: this.accessors,
        //         renderer: this.renderer,
        //         scales: this.scales,
        //     }))
        // );
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "Brno",
            name: "Brno",
            data: [
                { name: "Q1 2018", value: 167 },
                { name: "Q2 2018", value: 122 },
                { name: "Q3 2018", value: 141 },
                { name: "Q4 2018", value: 66 },
            ],
        },
        {
            id: "Austin",
            name: "Austin",
            data: [
                { name: "Q1 2018", value: 167 },
                { name: "Q2 2018", value: 198 },
                { name: "Q3 2018", value: 208 },
                { name: "Q4 2018", value: 233 },
            ],
        },
    ];
}
