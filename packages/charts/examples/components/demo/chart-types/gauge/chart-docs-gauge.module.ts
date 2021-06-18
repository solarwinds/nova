/* eslint-disable max-len */
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiTextboxModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartDocsGaugeComponent } from "./chart-docs-gauge.component";
import { GaugeVisualTestComponent } from "./visual-test/gauge-visual-test.component";
import { HorizontalGaugeTesterComponent } from "./visual-test/horizontal/horizontal-gauge-tester.component";
import { DonutGaugeTesterComponent } from "./visual-test/donut/donut-gauge-tester.component";
import { VerticalGaugeTesterComponent } from "./visual-test/vertical/vertical-gauge-tester.component";
import { DonutGaugeBasicExampleComponent } from "./donut/donut-basic/donut-gauge-basic-example.component";
import { DonutGaugeWithContentExampleComponent } from "./donut/donut-with-content/donut-gauge-with-content-example.component";
import { DonutGaugeWithThresholdMarkersExampleComponent } from "./donut/donut-with-threshold-markers/donut-gauge-with-threshold-markers-example.component";
import { DonutGaugeWithThresholdTogglingExampleComponent } from "./donut/donut-with-threshold-toggling/donut-gauge-with-threshold-toggling-example.component";
import { DonutGaugeWithCustomThresholdLabelsExampleComponent } from "./donut/donut-with-custom-threshold-labels/donut-gauge-with-custom-threshold-labels-example.component";
import { DonutGaugeWithMarkerTogglingExampleComponent } from "./donut/donut-with-marker-toggling/donut-gauge-with-marker-toggling-example.component";
import { HorizontalGaugeBasicExampleComponent } from "./linear/horizontal-gauge-basic-example.component";
import { VerticalGaugeBasicExampleComponent } from "./linear/vertical-gauge-basic-example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsGaugeComponent,
        data: {
            showThemeSwitcher: true,
        },
    },
    {
        path: "visual-test",
        component: GaugeVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-basic",
        component: DonutGaugeBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-with-content",
        component: DonutGaugeWithContentExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-with-custom-labels",
        component: DonutGaugeWithCustomThresholdLabelsExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-with-marker-toggling",
        component: DonutGaugeWithMarkerTogglingExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-with-threshold-markers",
        component: DonutGaugeWithThresholdMarkersExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-with-threshold-toggling",
        component: DonutGaugeWithThresholdTogglingExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "horizontal-basic",
        component: HorizontalGaugeBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "vertical-basic",
        component: VerticalGaugeBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsGaugeComponent,
        GaugeVisualTestComponent,
        HorizontalGaugeBasicExampleComponent,
        HorizontalGaugeTesterComponent,
        DonutGaugeTesterComponent,
        DonutGaugeBasicExampleComponent,
        DonutGaugeWithContentExampleComponent,
        DonutGaugeWithCustomThresholdLabelsExampleComponent,
        DonutGaugeWithMarkerTogglingExampleComponent,
        DonutGaugeWithThresholdMarkersExampleComponent,
        DonutGaugeWithThresholdTogglingExampleComponent,
        VerticalGaugeBasicExampleComponent,
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
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsGaugeModule {
}
