import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

const exampleRoutes: Routes = [
    {
        path: "bar",
        loadChildren: async () =>
            import("./bar/chart-docs-bar.module").then(
                (m) => m.ChartDocsBarModule
            ),
    },
    {
        path: "bucketed-bar",
        loadChildren: async () =>
            import("./bucketed-bar/chart-docs-bucketed-bar.module").then(
                (m) => m.ChartDocsBucketedBarModule
            ),
    },
    {
        path: "line",
        loadChildren: async () =>
            import("./line/chart-docs-line.module").then(
                (m) => m.ChartDocsLineModule
            ),
    },
    {
        path: "pie-and-donut",
        loadChildren: async () =>
            import("./pie-and-donut/chart-docs-pie-and-donut.module").then(
                (m) => m.ChartDocsPieAndDonutModule
            ),
    },
    {
        path: "spark",
        loadChildren: async () =>
            import("./spark/chart-docs-spark.module").then(
                (m) => m.ChartDocsSparkModule
            ),
    },
    {
        path: "gauge",
        loadChildren: async () =>
            import("./gauge/chart-docs-gauge.module").then(
                (m) => m.ChartDocsGaugeModule
            ),
    },
    {
        path: "status",
        loadChildren: async () =>
            import("./status/chart-docs-status.module").then(
                (m) => m.ChartDocsStatusModule
            ),
    },
    {
        path: "waterfall",
        loadChildren: async () =>
            import("./waterfall/chart-docs-waterfall.module").then(
                (m) => m.ChartDocsWaterfallModule
            ),
    },
    {
        path: "area",
        loadChildren: async () =>
            import("./area/chart-docs-area.module").then(
                (m) => m.ChartDocsAreaModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [
        NuiChartsModule,
        NuiIconModule,
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
export class ChartDocsChartTypesModule {}
