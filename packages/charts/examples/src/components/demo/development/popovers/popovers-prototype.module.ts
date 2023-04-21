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
    NuiDocsModule,
    NuiIconModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { DataPointPopoversPrototypeComponent } from "./data-point/data-point-popovers-prototype.component";
import { LineChartPopoverPrototypeComponent } from "./line-chart/line-chart-popover-prototype.component";
import { PopoverPerformanceTestComponent } from "./line-chart/popover-performance-test.component";

const routes: Routes = [
    {
        path: "line",
        component: LineChartPopoverPrototypeComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "performance",
        component: PopoverPerformanceTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "data-point",
        component: DataPointPopoversPrototypeComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
];

@NgModule({
    declarations: [
        LineChartPopoverPrototypeComponent,
        DataPointPopoversPrototypeComponent,
        PopoverPerformanceTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiIconModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
    ],
    providers: [],
})
export default class PopoversPrototypeModule {}
