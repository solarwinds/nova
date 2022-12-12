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
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsLineComponent } from "./chart-docs-line.component";
import { LineChartBasicExampleComponent } from "./line-chart-basic/line-chart-basic.example.component";
import { LineChartInterruptedBasicExampleComponent } from "./line-chart-interrupted-basic/line-chart-interrupted-basic-example.component";
import { LineChartInterruptedCalculatedExampleComponent } from "./line-chart-interrupted-calculated/line-chart-interrupted-calculated-example.component";
import { LineChartInterruptedPathTerminusExampleComponent } from "./line-chart-interrupted-path-terminus/line-chart-interrupted-path-terminus-example.component";
import { LineChartStackedTestComponent } from "./line-chart-stacked-test/line-chart-stacked-test.component";
import { LineChartTestComponent } from "./line-chart-test/line-chart-test.component";
import { LineChartVisualTestComponent } from "./line-chart-visual-test/line-chart-visual-test.component";
import { LineChartWith2YAxesExampleComponent } from "./line-chart-with-2y-axes/line-chart-with-2y-axes-example.component";
import { LineChartWithAxisLabelsExampleComponent } from "./line-chart-with-axis-labels/line-chart-with-axis-labels.example.component";
import { LineChartWithLargeValuesExampleComponent } from "./line-chart-with-large-values/line-chart-with-large-values.example.component";
import { LineChartWithLegendExampleComponent } from "./line-chart-with-legend/line-chart-with-legend.example.component";
import { LineChartWithRichTileLegendExampleComponent } from "./line-chart-with-rich-tile-legend/line-chart-with-rich-tile-legend.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsLineComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "axis-labels",
        component: LineChartWithAxisLabelsExampleComponent,
    },
    {
        path: "two-y-axes",
        component: LineChartWith2YAxesExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "basic",
        component: LineChartBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "rich-legend-tile",
        component: LineChartWithRichTileLegendExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "interrupted",
        component: LineChartInterruptedBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "interrupted-calculated",
        component: LineChartInterruptedCalculatedExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "interrupted-path-terminus",
        component: LineChartInterruptedPathTerminusExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: LineChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "stacked-test",
        component: LineChartStackedTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "visual-test",
        component: LineChartVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsLineComponent,
        LineChartWithAxisLabelsExampleComponent,
        LineChartBasicExampleComponent,
        LineChartStackedTestComponent,
        LineChartTestComponent,
        LineChartVisualTestComponent,
        LineChartWithLegendExampleComponent,
        LineChartWithRichTileLegendExampleComponent,
        LineChartWith2YAxesExampleComponent,
        LineChartInterruptedBasicExampleComponent,
        LineChartInterruptedPathTerminusExampleComponent,
        LineChartInterruptedCalculatedExampleComponent,
        LineChartWithLargeValuesExampleComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiSwitchModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiChartsModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsLineModule {}
