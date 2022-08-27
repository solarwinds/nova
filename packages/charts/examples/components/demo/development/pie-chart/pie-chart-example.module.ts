import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiExpanderModule,
    NuiTextboxModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { PieChartTestComponent } from "./pie-chart-test/pie-chart.example.component";

const bubbleRoutes: Routes = [
    {
        path: "",
        component: PieChartTestComponent,
    },
];

@NgModule({
    declarations: [PieChartTestComponent],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiTextboxModule,
        RouterModule.forChild(bubbleRoutes),
        NuiExpanderModule,
    ],
})
export class PieChartExampleModule {}
