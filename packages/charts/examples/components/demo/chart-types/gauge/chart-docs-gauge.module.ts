import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCommonModule, NuiDocsModule, NuiFormFieldModule, NuiIconModule, NuiMessageModule, NuiTextboxModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartDocsGaugeComponent } from "./chart-docs-gauge.component";
import { GaugeVisualTestComponent } from "./visual-test/gauge-visual-test.component";
import { HorizontalGaugeTesterComponent } from "./visual-test/horizontal/horizontal-gauge-tester.component";
import { DonutGaugeTesterComponent } from "./visual-test/donut/donut-gauge-tester.component";
import { VerticalGaugeTesterComponent } from "./visual-test/vertical/vertical-gauge-tester.component";
import { DonutGaugeBasicExampleComponent } from "./donut-basic/donut-gauge-basic-example.component";
import { DonutGaugeWithContentExampleComponent } from "./donut-with-content/donut-gauge-with-content-example.component";
import { DonutGaugeWithThresholdMarkersExampleComponent } from "./donut-with-threshold-markers/donut-gauge-with-threshold-markers-example.component";

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
        path: "donut-with-threshold-markers",
        component: DonutGaugeWithThresholdMarkersExampleComponent,
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
];

@NgModule({
    declarations: [
        ChartDocsGaugeComponent,
        GaugeVisualTestComponent,
        HorizontalGaugeTesterComponent,
        DonutGaugeTesterComponent,
        DonutGaugeBasicExampleComponent,
        DonutGaugeWithContentExampleComponent,
        DonutGaugeWithThresholdMarkersExampleComponent,
        VerticalGaugeTesterComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
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
