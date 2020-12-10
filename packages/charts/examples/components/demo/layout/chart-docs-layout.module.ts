import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiDocsModule, NuiSwitchModule, SrlcStage } from "@nova-ui/bits";

import { DemoCommonModule } from "../common/demo-common.module";

import { ChartDocsLayoutComponent } from "./chart-docs-layout.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsLayoutComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsLayoutComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiDocsModule,
        NuiSwitchModule,
        RouterModule.forChild(exampleRoutes),
    ],
})
export class ChartDocsLayoutModule {
}
