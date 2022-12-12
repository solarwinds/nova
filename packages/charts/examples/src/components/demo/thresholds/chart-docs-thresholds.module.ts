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

import { DemoCommonModule } from "../common/demo-common.module";
import { ChartDocsThresholdsComponent } from "./chart-docs-thresholds.component";
import { ThresholdsBasicExampleComponent } from "./thresholds-basic/thresholds-basic.example.component";
import { ThresholdsSparkExampleComponent } from "./thresholds-spark/thresholds-spark.example.component";
import { ThresholdsSummaryExampleComponent } from "./thresholds-summary/thresholds-summary-example/thresholds-summary.example.component";
import { ThresholdsSummaryTestHarnessComponent } from "./thresholds-summary/thresholds-summary-test-harness/thresholds-summary-test-harness.component";
import { ThresholdsSummaryTestComponent } from "./thresholds-summary/thresholds-summary-test/thresholds-summary-test.component";
import { ThresholdsSummaryVisualTestComponent } from "./thresholds-summary/thresholds-summary-visual-test/thresholds-summary-visual-test.component";
// eslint-disable-next-line max-len
import { ThresholdsSummaryWithIntervalScaleTestComponent } from "./thresholds-summary/thresholds-summary-with-interval-scale-test/thresholds-summary-with-interval-scale-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsThresholdsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: ThresholdsBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "spark",
        component: ThresholdsSparkExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary",
        component: ThresholdsSummaryExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary-test",
        component: ThresholdsSummaryTestHarnessComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary-visual-test",
        component: ThresholdsSummaryVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsThresholdsComponent,
        ThresholdsBasicExampleComponent,
        ThresholdsSparkExampleComponent,
        ThresholdsSummaryExampleComponent,
        ThresholdsSummaryTestComponent,
        ThresholdsSummaryTestHarnessComponent,
        ThresholdsSummaryVisualTestComponent,
        ThresholdsSummaryWithIntervalScaleTestComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiIconModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsThresholdsModule {}
