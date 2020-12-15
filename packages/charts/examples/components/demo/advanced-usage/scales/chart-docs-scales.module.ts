import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsScalesComponent } from "./chart-docs-scales.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsScalesComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
    },
    {
        path: "domains",
        loadChildren: () => import("components/demo/advanced-usage/scales/domains/chart-docs-domains.module").then(m => m.ChartDocsDomainsModule),
    },
    {
        path: "formatters",
        loadChildren: () => import("components/demo/advanced-usage/scales/formatters/chart-docs-formatters.module").then(m => m.ChartDocsFormattersModule),
    },
];

@NgModule({
    declarations: [
        ChartDocsScalesComponent,
    ],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsScalesModule {
}
