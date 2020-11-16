import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NuiCommonModule } from "@solarwinds/nova-bits";
import { NuiChartsModule } from "@solarwinds/nova-charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { GaugeChartPrototypeComponent } from "./chart-prototype/gauge-chart-prototype.component";
import { GaugeTestPageComponent } from "./chart-prototype/gauge-test-page.component";
import { GaugeComponentPrototypeComponent } from "./component-prototype/gauge-component-prototype.component";

const routes: Routes = [
    {
        path: "chart",
        component: GaugeTestPageComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "component",
        component: GaugeComponentPrototypeComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        GaugeComponentPrototypeComponent,
        GaugeChartPrototypeComponent,
        GaugeTestPageComponent,
    ],
    imports: [
        NuiCommonModule,
        DemoCommonModule,
        NuiChartsModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
})
export class GaugePrototypesModule {
}
