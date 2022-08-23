import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NuiButtonModule, NuiIconModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { SparkPrototypeComponent } from "./spark-prototype/spark-prototype.component";

const routes: Routes = [
    {
        path: "",
        component: SparkPrototypeComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [SparkPrototypeComponent],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiChartsModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
})
export class SparkPrototypeModule {}
