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
    NuiMessageModule,
    NuiTableModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsSparkComponent } from "./chart-docs-spark.component";
import { SparkChartAreaMultipleExampleComponent } from "./spark-chart-area-multiple/spark-chart-area-multiple.example.component";
import { SparkChartBasicExampleComponent } from "./spark-chart-basic/spark-chart-basic.example.component";
import { SparkChartLegendExampleComponent } from "./spark-chart-legend/spark-chart-legend.example.component";
import { SparkChartMultipleExampleComponent } from "./spark-chart-multiple/spark-chart-multiple.example.component";
import { AreaSparkMinimalTestComponent } from "./spark-chart-stroke-test/area-spark-minimal-test.component";
import { SparkChartTableExampleComponent } from "./spark-chart-table/spark-chart-table.example.component";
import { SparkChartTestComponent } from "./spark-chart-test/spark-chart-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsSparkComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: SparkChartBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "legend",
        component: SparkChartLegendExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "multiple",
        component: SparkChartMultipleExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "table",
        component: SparkChartTableExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "area",
        component: SparkChartAreaMultipleExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: SparkChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsSparkComponent,
        SparkChartBasicExampleComponent,
        SparkChartLegendExampleComponent,
        SparkChartMultipleExampleComponent,
        SparkChartTableExampleComponent,
        SparkChartAreaMultipleExampleComponent,
        SparkChartTestComponent,
        AreaSparkMinimalTestComponent,
    ],
    imports: [
        FormsModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiTableModule,
        DemoCommonModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsSparkModule {}
