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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { BarChartHorizontalExampleComponent } from "./bar-chart-horizontal/bar-chart-horizontal.example.component";
import { BarChartTestComponent } from "./bar-chart-test/bar-chart-test.component";
// eslint-disable-next-line max-len
import { BarChartTickLabelMaxWidthWithMarginTestComponent } from "./bar-chart-test/bar-chart-tick-label-max-width-with-margin/bar-chart-tick-label-max-width-with-margin-test.component";
import { BarChartTickLabelMaxWidthTestComponent } from "./bar-chart-test/bar-chart-tick-label-max-width/bar-chart-tick-label-max-width-test.component";
import { BasicHorizontalBarChartTestComponent } from "./bar-chart-test/basic-horizontal/basic-horizontal-bar-chart-test.component";
import { BasicVerticalBarChartTestComponent } from "./bar-chart-test/basic-vertical/basic-vertical-bar-chart-test.component";
import { BarChartTimeIntervalDstTestComponent } from "./bar-chart-test/daylight-saving-time/bar-chart-time-interval/bar-chart-time-interval-dst-test.component";
import { DstTimeIntervalTestPageComponent } from "./bar-chart-test/daylight-saving-time/dst-time-interval-test-page.component";
import { HorizontalWithLegendBarChartTestComponent } from "./bar-chart-test/horizontal-with-legend/horizontal-with-legend-bar-chart-test.component";
import { TimeIntervalTestComponent } from "./bar-chart-test/time-interval/time-interval.test.component";
import { VerticalWithLegendBarChartTestComponent } from "./bar-chart-test/vertical-with-legend/vertical-with-legend-bar-chart-test.component";
import { VerticalWithTimescaleBarChartTestComponent } from "./bar-chart-test/vertical-with-timescale/vertical-with-timescale-bar-chart-test.component";
import { BarChartTimeIntervalExampleComponent } from "./bar-chart-time-interval/bar-chart-time-interval.example.component";
import { BarChartTimeScaleExampleComponent } from "./bar-chart-time-scale/bar-chart-time-scale.example.component";
import { BarChartWithLegendExampleComponent } from "./bar-chart-with-legend/bar-chart-with-legend.example.component";
import { BarChartExampleComponent } from "./bar-chart/bar-chart.example.component";
import { ChartDocsBarComponent } from "./chart-docs-bar.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsBarComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "bar-chart",
        component: BarChartExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "horizontal",
        component: BarChartHorizontalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "with-legend",
        component: BarChartWithLegendExampleComponent,
    },
    {
        path: "test",
        component: BarChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "dst-time-interval-test",
        component: DstTimeIntervalTestPageComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "time-interval",
        component: BarChartTimeIntervalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "vertical-bar-test",
        component: BasicVerticalBarChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "horizontal-bar-test",
        component: BasicHorizontalBarChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bar-chart-max-width-test",
        component: BarChartTickLabelMaxWidthTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bar-chart-max-width-with-margin-test",
        component: BarChartTickLabelMaxWidthWithMarginTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsBarComponent,
        BarChartExampleComponent,
        BarChartHorizontalExampleComponent,
        BarChartTimeScaleExampleComponent,
        BarChartTimeIntervalExampleComponent,
        BarChartTickLabelMaxWidthTestComponent,
        BarChartTickLabelMaxWidthWithMarginTestComponent,
        BarChartWithLegendExampleComponent,
        BarChartTestComponent,
        BasicHorizontalBarChartTestComponent,
        BasicVerticalBarChartTestComponent,
        DstTimeIntervalTestPageComponent,
        BarChartTimeIntervalDstTestComponent,
        VerticalWithTimescaleBarChartTestComponent,
        VerticalWithLegendBarChartTestComponent,
        HorizontalWithLegendBarChartTestComponent,
        TimeIntervalTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsBarModule {}
