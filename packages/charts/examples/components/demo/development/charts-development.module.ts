import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const chartsRoutes: Routes = [
    {
        path: "core",
        loadChildren: () => import("./core/core-example.module").then(m => m.CoreExampleModule),
    },
    {
        path: "pie",
        loadChildren: () => import("./pie-chart/pie-chart-example.module").then(m => m.PieChartExampleModule),
    },
    {
        path: "bar",
        loadChildren: () => import("./bar/bar-prototype.module").then(m => m.BarPrototypeModule),
    },
    {
        path: "collection",
        loadChildren: () => import("./chart-collection/chart-collection-example.module").then(m => m.ChartCollectionExampleModule),
    },
    {
        path: "popovers",
        loadChildren: () => import("./popovers/popovers-prototype.module").then(m => m.PopoversPrototypeModule),
    },
    {
        path: "tooltips",
        loadChildren: () => import("./tooltips/tooltips-prototype.module").then(m => m.TooltipsPrototypeModule),
    },
    {
        path: "spark",
        loadChildren: () => import("./spark/spark-prototype.module").then(m => m.SparkPrototypeModule),
    },
    {
        path: "gauge",
        loadChildren: () => import("./gauge/gauge-prototypes.module").then(m => m.GaugePrototypesModule),
    },
    {
        path: "type-switch",
        loadChildren: () => import("./type-switch/type-switch-example.module").then(m => m.TypeSwitchExampleModule),
    },
    {
        path: "status",
        loadChildren: () => import("./status/chart-status-example.module").then(m => m.ChartStatusExampleModule),
    },
    {
        path: "time-bands",
        loadChildren: () => import("./time-bands/time-bands-example.module").then(m => m.TimeBandsExampleModule),
    },
    {
        path: "data-point-selection",
        loadChildren: () => import("./data-point-selection/data-point-selection-prototype.module").then(m => m.DataPointSelectionPrototypeModule),
    },
    {
        path: "thresholds",
        loadChildren: () => import("./thresholds/thresholds-prototype.module").then(m => m.ThresholdsPrototypeModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(chartsRoutes),
    ],
})
export class ChartsDevelopmentModule {
}
