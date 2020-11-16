import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCommonModule, NuiDocsModule, NuiIconModule, NuiMessageModule } from "@solarwinds/nova-bits";
import { NuiChartsModule } from "@solarwinds/nova-charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartDocsGaugeComponent } from "./chart-docs-gauge.component";
import { GaugeTesterComponent } from "./visual-test/gauge-tester.component";
import { GaugeVisualTestComponent } from "./visual-test/gauge-visual-test.component";

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
];

@NgModule({
    declarations: [
        ChartDocsGaugeComponent,
        GaugeVisualTestComponent,
        GaugeTesterComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiCommonModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsGaugeModule {
}
