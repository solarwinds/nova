import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ThresholdsPrototypeComponent } from "./thresholds-prototype.component";

const routes: Routes = [
    {
        path: "",
        component: ThresholdsPrototypeComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [ThresholdsPrototypeComponent],
    imports: [DemoCommonModule, NuiChartsModule, RouterModule.forChild(routes)],
})
export class ThresholdsPrototypeModule {}
