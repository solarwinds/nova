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
        path: "accessors",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/accessors/chart-docs-accessors.module"
            ).then((m) => m.ChartDocsAccessorsModule),
    },
    {
        path: "chart-setup",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/chart-setup/chart-docs-chart-setup.module"
            ).then((m) => m.ChartDocsChartSetupModule),
    },
    {
        path: "events",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/events/chart-docs-events.module"
            ).then((m) => m.ChartDocsEventsModule),
    },
    {
        path: "grid-config",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/grid-config/chart-docs-grid-config.module"
            ).then((m) => m.ChartDocsGridConfigModule),
    },
    {
        path: "legend",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/legend/chart-docs-legend-example.module"
            ).then((m) => m.ChartDocsLegendExampleModule),
    },
    {
        path: "scales",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/scales/chart-docs-scales.module"
            ).then((m) => m.ChartDocsScalesModule),
    },
];

@NgModule({
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
export class ChartDocsAdvancedUsageModule {}
