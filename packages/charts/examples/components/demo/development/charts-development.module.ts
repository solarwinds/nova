import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const chartsRoutes: Routes = [
    {
        path: "core",
        loadChildren: async () =>
            import("./core/core-example.module").then(
                (m) => m.CoreExampleModule
            ),
    },
    {
        path: "pie",
        loadChildren: async () =>
            import("./pie-chart/pie-chart-example.module").then(
                (m) => m.PieChartExampleModule
            ),
    },
    {
        path: "bar",
        loadChildren: async () =>
            import("./bar/bar-prototype.module").then(
                (m) => m.BarPrototypeModule
            ),
    },
    {
        path: "collection",
        loadChildren: async () =>
            import("./chart-collection/chart-collection-example.module").then(
                (m) => m.ChartCollectionExampleModule
            ),
    },
    {
        path: "popovers",
        loadChildren: async () =>
            import("./popovers/popovers-prototype.module").then(
                (m) => m.PopoversPrototypeModule
            ),
    },
    {
        path: "tooltips",
        loadChildren: async () =>
            import("./tooltips/tooltips-prototype.module").then(
                (m) => m.TooltipsPrototypeModule
            ),
    },
    {
        path: "spark",
        loadChildren: async () =>
            import("./spark/spark-prototype.module").then(
                (m) => m.SparkPrototypeModule
            ),
    },
    {
        path: "gauge",
        loadChildren: async () =>
            import("./gauge/gauge-prototypes.module").then(
                (m) => m.GaugePrototypesModule
            ),
    },
    {
        path: "type-switch",
        loadChildren: async () =>
            import("./type-switch/type-switch-example.module").then(
                (m) => m.TypeSwitchExampleModule
            ),
    },
    {
        path: "status",
        loadChildren: async () =>
            import("./status/chart-status-example.module").then(
                (m) => m.ChartStatusExampleModule
            ),
    },
    {
        path: "time-bands",
        loadChildren: async () =>
            import("./time-bands/time-bands-example.module").then(
                (m) => m.TimeBandsExampleModule
            ),
    },
    {
        path: "data-point-selection",
        loadChildren: async () =>
            import(
                "./data-point-selection/data-point-selection-prototype.module"
            ).then((m) => m.DataPointSelectionPrototypeModule),
    },
    {
        path: "thresholds",
        loadChildren: async () =>
            import("./thresholds/thresholds-prototype.module").then(
                (m) => m.ThresholdsPrototypeModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(chartsRoutes)],
})
export class ChartsDevelopmentModule {}
