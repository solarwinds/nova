import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiDividerModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { StackedVerticalBarPrototypeComponent } from "./stacked-vertical/stacked-vertical-bar-prototype.component";

const routes: Routes = [
    {
        path: "stacked-vertical",
        component: StackedVerticalBarPrototypeComponent,
    },
];

@NgModule({
    declarations: [
        StackedVerticalBarPrototypeComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiDividerModule,
        RouterModule.forChild(routes),
    ],
})
export class BarPrototypeModule {
}
