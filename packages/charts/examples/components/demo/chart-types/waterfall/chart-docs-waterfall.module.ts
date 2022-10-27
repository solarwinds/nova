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

import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsWaterfallComponent } from "./chart-docs-waterfall.component";
import { WaterfallChartAdvancedComponent } from "./waterfall-advanced-charts/waterfall-chart-advanced.example.component";
import { WaterfallChartSimpleComponent } from "./waterfall-chart-simple/waterfall-chart-simple.example.component";
import { WaterfallChartTestComponent } from "./waterfall-test/waterfall-chart-test.component";

const collectionRoutes: Routes = [
    {
        path: "",
        component: ChartDocsWaterfallComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "simple",
        component: WaterfallChartSimpleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "advanced",
        component: WaterfallChartAdvancedComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: WaterfallChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsWaterfallComponent,
        WaterfallChartSimpleComponent,
        WaterfallChartAdvancedComponent,
        WaterfallChartTestComponent,
    ],
    imports: [
        DragDropModule,
        NuiIconModule,
        NuiDocsModule,
        DemoCommonModule,
        NuiChartsModule,
        NuiMessageModule,
        RouterModule.forChild(collectionRoutes),
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
})
export class ChartDocsWaterfallModule {}
