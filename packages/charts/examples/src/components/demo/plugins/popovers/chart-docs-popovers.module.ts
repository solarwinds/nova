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
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { BarChartWithPopoverExampleComponent } from "./bar-chart/bar-chart-with-popover.example.component";
import { ChartDocsPopoversComponent } from "./chart-docs-popovers.component";
import { DonutChartWithPopoverExampleComponent } from "./donut-chart/donut-chart-with-popover.example.component";
import { LineChartWithPopoverExampleComponent } from "./line-chart/line-chart-with-popover.example.component";
import { PopoverVisualTestComponent } from "./popover-visual-test/popover-visual-test.component";
import { DemoCommonModule } from "../../common/demo-common.module";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsPopoversComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "bar",
        component: BarChartWithPopoverExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "line",
        component: LineChartWithPopoverExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "visual-test",
        component: PopoverVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BarChartWithPopoverExampleComponent,
        DonutChartWithPopoverExampleComponent,
        ChartDocsPopoversComponent,
        LineChartWithPopoverExampleComponent,
        PopoverVisualTestComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsPopoversModule {}
