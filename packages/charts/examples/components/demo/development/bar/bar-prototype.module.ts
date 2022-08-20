import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiDividerModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { StackedBarPrototypeComponent } from "./stacked-bar/stacked-bar-prototype.component";

const routes: Routes = [
    {
        path: "stacked-bar",
        component: StackedBarPrototypeComponent,
    },
];

@NgModule({
    declarations: [StackedBarPrototypeComponent],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiDividerModule,
        RouterModule.forChild(routes),
    ],
})
export class BarPrototypeModule {}
