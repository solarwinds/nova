import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

const exampleRoutes: Routes = [
    {
        path: "base-grid",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/grid-config/base-grid/chart-docs-base-grid.module"
            ).then((m) => m.ChartDocsBaseGridModule),
    },
];

@NgModule({
    declarations: [],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
})
export class ChartDocsGridConfigModule {}
