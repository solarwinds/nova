import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { TestCommonModule } from "./common/common.module";

const routes = [
    {
        path: "overview",
        loadChildren: async () =>
            import("./visual/overview/overview.module").then(
                (m) => m.OverviewModule
            ),
    },
    {
        path: "proportional",
        loadChildren: async () =>
            import(
                "./visual/proportional/proportional-widget-test.module"
            ).then((m) => m.ProportionalWidgetTestModule),
    },
    {
        path: "configurator",
        loadChildren: async () =>
            import("./visual/configurator/configurator-test.module").then(
                (m) => m.ConfiguratorTestModule
            ),
    },
    {
        path: "timeseries",
        loadChildren: async () =>
            import("./visual/timeseries/timeseries-test.module").then(
                (m) => m.TimeseriesTestModule
            ),
    },
    {
        path: "table",
        loadChildren: async () =>
            import("./visual/table/table-test.module").then(
                (m) => m.TableTestModule
            ),
    },
    {
        path: "kpi",
        loadChildren: async () =>
            import("./visual/kpi/kpi-widget-test.module").then(
                (m) => m.KpiWidgetTestModule
            ),
    },
    {
        path: "drilldown",
        loadChildren: async () =>
            import("./visual/drilldown/drilldown-widget-test.module").then(
                (m) => m.DrilldownWidgetTestModule
            ),
    },
];

@NgModule({
    imports: [TestCommonModule, RouterModule.forChild(routes)],
})
export class DashboardTestModule {}
