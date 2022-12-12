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
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { BarChartGroupedHorizontalExampleComponent } from "./bar-chart-grouped-horizontal/bar-chart-grouped-horizontal.example.component";
import { BarChartGroupedExampleComponent } from "./bar-chart-grouped/bar-chart-grouped.example.component";
import { BarChartPercentageExampleComponent } from "./bar-chart-percentage/bar-chart-percentage.example.component";
import { BarChartStackedHorizontalExampleComponent } from "./bar-chart-stacked-horizontal/bar-chart-stacked-horizontal.example.component";
import { BarChartStackedExampleComponent } from "./bar-chart-stacked/bar-chart-stacked.example.component";
import { BarChartBucketedTestComponent } from "./bar-chart-test/bar-chart-bucketed-test.component";
import { BasicStackedHorizontalBarChartTestComponent } from "./bar-chart-test/basic-stacked-horizontal/basic-stacked-horizontal-bar-chart-test.component";
import { BasicStackedVerticalBarChartTestComponent } from "./bar-chart-test/basic-stacked-vertical/basic-stacked-vertical-bar-chart-test.component";
import { GroupedHorizontalBarChartTestComponent } from "./bar-chart-test/grouped-horizontal/grouped-horizontal-bar-chart-test.component";
import { GroupedVerticalBarChartTestComponent } from "./bar-chart-test/grouped-vertical/grouped-vertical-bar-chart-test.component";
import { ProportionalVerticalBarChartTestComponent } from "./bar-chart-test/proportional-vertical/proportional-vertical-bar-chart-test.component";
import { ChartDocsBucketedBarComponent } from "./chart-docs-bucketed-bar.component";

const routes: Routes = [
    {
        path: "",
        component: ChartDocsBucketedBarComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "stacked",
        component: BarChartStackedExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "stacked-test",
        component: BasicStackedVerticalBarChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "percentage",
        component: BarChartPercentageExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "grouped",
        component: BarChartGroupedExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "grouped-horizontal",
        component: BarChartGroupedHorizontalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: BarChartBucketedTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsBucketedBarComponent,
        BarChartGroupedExampleComponent,
        BarChartGroupedHorizontalExampleComponent,
        BarChartPercentageExampleComponent,
        BarChartStackedExampleComponent,
        BarChartStackedHorizontalExampleComponent,
        BasicStackedHorizontalBarChartTestComponent,
        BasicStackedVerticalBarChartTestComponent,
        GroupedHorizontalBarChartTestComponent,
        GroupedVerticalBarChartTestComponent,
        ProportionalVerticalBarChartTestComponent,
        BarChartBucketedTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiSwitchModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    providers: [],
})
export default class ChartDocsBucketedBarModule {}
