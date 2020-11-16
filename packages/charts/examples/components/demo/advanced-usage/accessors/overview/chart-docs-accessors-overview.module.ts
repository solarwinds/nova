import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule, SrlcStage } from "@solarwinds/nova-bits";
import { NuiChartsModule } from "@solarwinds/nova-charts";

import { ChartDocsAccessorsOverviewComponent } from "./chart-docs-accessors-overview.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsAccessorsOverviewComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsAccessorsOverviewComponent,
    ],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsAccessorsOverviewModule {
}
