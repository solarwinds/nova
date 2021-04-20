import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NuiCommonModule, NuiFormFieldModule, NuiTextboxModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { DonutGaugePrototypeComponent } from "./donut/donut-gauge-prototype.component";
import { GaugeTestPageComponent } from "./gauge-test-page.component";
import { LinearGaugeHorizontalPrototypeComponent } from "./horizontal/linear-gauge-horizontal-prototype.component";
import { LinearGaugeVerticalPrototypeComponent } from "./vertical/linear-gauge-vertical-prototype.component";

const routes: Routes = [
    {
        path: "",
        component: GaugeTestPageComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        LinearGaugeHorizontalPrototypeComponent,
        LinearGaugeVerticalPrototypeComponent,
        DonutGaugePrototypeComponent,
        GaugeTestPageComponent,
    ],
    imports: [
        NuiCommonModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        DemoCommonModule,
        NuiChartsModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
})
export class GaugePrototypesModule {
}
