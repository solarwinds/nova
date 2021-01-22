import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NuiCommonModule, NuiTextboxModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { GaugeTestPageComponent } from "./chart-prototype/gauge-test-page.component";
import { LinearGaugeChartHorizontalPrototypeComponent } from "./chart-prototype/horizontal/linear-gauge-horizontal-chart-prototype.component";
import { RadialGaugeChartPrototypeComponent } from "./chart-prototype/radial/radial-gauge-chart-prototype.component";
import { LinearGaugeChartVerticalPrototypeComponent } from "./chart-prototype/vertical/linear-gauge-vertical-chart-prototype.component";
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
        LinearGaugeChartHorizontalPrototypeComponent,
        LinearGaugeChartVerticalPrototypeComponent,
        RadialGaugeChartPrototypeComponent,
        GaugeTestPageComponent,
    ],
    imports: [
        NuiCommonModule,
        NuiTextboxModule,
        DemoCommonModule,
        NuiChartsModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
})
export class GaugePrototypesModule {
}
