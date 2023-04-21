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

/* eslint-disable max-len */
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsGaugeComponent } from "./chart-docs-gauge.component";
import { DonutGaugeBasicExampleComponent } from "./donut/donut-basic/donut-gauge-basic.example.component";
import { DonutGaugeWithContentExampleComponent } from "./donut/donut-with-content/donut-gauge-with-content.example.component";
import { DonutGaugeWithCustomThresholdLabelsExampleComponent } from "./donut/donut-with-custom-threshold-labels/donut-gauge-with-custom-threshold-labels.example.component";
import { DonutGaugeWithThresholdMarkerTogglingExampleComponent } from "./donut/donut-with-threshold-marker-toggling/donut-gauge-with-threshold-marker-toggling.example.component";
import { DonutGaugeWithThresholdTogglingExampleComponent } from "./donut/donut-with-threshold-toggling/donut-gauge-with-threshold-toggling.example.component";
import { DonutGaugeWithThresholdsExampleComponent } from "./donut/donut-with-thresholds/donut-gauge-with-thresholds.example.component";
import { DonutGaugeWithoutThresholdMarkersExampleComponent } from "./donut/donut-without-threshold-markers/donut-gauge-without-threshold-markers.example.component";
import { HorizontalGaugeBasicExampleComponent } from "./linear/horizontal-basic/horizontal-gauge-basic.example.component";
import { LinearGaugeThicknessAdjustmentExampleComponent } from "./linear/linear-thickness-adjustment/linear-gauge-thickness-adjustment.example.component";
import { LinearGaugeWithThresholdsExampleComponent } from "./linear/linear-with-thresholds/linear-gauge-with-thresholds.example.component";
import { VerticalGaugeBasicExampleComponent } from "./linear/vertical-basic/vertical-gauge-basic.example.component";
import { DonutGaugeTesterComponent } from "./visual-test/donut/donut-gauge-tester.component";
import { GaugeVisualTestComponent } from "./visual-test/gauge-visual-test.component";
import { HorizontalGaugeTesterComponent } from "./visual-test/horizontal/horizontal-gauge-tester.component";
import { VerticalGaugeTesterComponent } from "./visual-test/vertical/vertical-gauge-tester.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsGaugeComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "visual-test",
        component: GaugeVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-basic",
        component: DonutGaugeBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-with-content",
        component: DonutGaugeWithContentExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-with-custom-labels",
        component: DonutGaugeWithCustomThresholdLabelsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-without-markers",
        component: DonutGaugeWithoutThresholdMarkersExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-with-marker-toggling",
        component: DonutGaugeWithThresholdMarkerTogglingExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-with-thresholds",
        component: DonutGaugeWithThresholdsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-with-threshold-toggling",
        component: DonutGaugeWithThresholdTogglingExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "horizontal-basic",
        component: HorizontalGaugeBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "vertical-basic",
        component: VerticalGaugeBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "linear-with-thresholds",
        component: LinearGaugeWithThresholdsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "linear-thickness",
        component: LinearGaugeWithThresholdsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsGaugeComponent,
        GaugeVisualTestComponent,
        HorizontalGaugeBasicExampleComponent,
        LinearGaugeWithThresholdsExampleComponent,
        HorizontalGaugeTesterComponent,
        DonutGaugeTesterComponent,
        DonutGaugeBasicExampleComponent,
        DonutGaugeWithContentExampleComponent,
        DonutGaugeWithCustomThresholdLabelsExampleComponent,
        DonutGaugeWithThresholdMarkerTogglingExampleComponent,
        DonutGaugeWithoutThresholdMarkersExampleComponent,
        DonutGaugeWithThresholdsExampleComponent,
        DonutGaugeWithThresholdTogglingExampleComponent,
        VerticalGaugeBasicExampleComponent,
        LinearGaugeThicknessAdjustmentExampleComponent,
        VerticalGaugeTesterComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiCheckboxModule,
        NuiCommonModule,
        NuiFormFieldModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiTextboxModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsGaugeModule {}
