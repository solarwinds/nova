import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { TestCommonModule } from "./common/common.module";

const routes = [
    {
        path: "overview",
        loadChildren: () => import("./visual/overview/overview.module").then(m => m.OverviewModule),
    },
    {
        path: "proportional",
        loadChildren: () => import("./visual/proportional/proportional-widget-test.module").then(m => m.ProportionalWidgetTestModule),
    },
    {
        path: "configurator",
        loadChildren: () => import("./visual/configurator/configurator-test.module").then(m => m.ConfiguratorTestModule),
    },
    {
        path: "timeseries",
        loadChildren: () => import("./visual/timeseries/timeseries-test.module").then(m => m.TimeseriesTestModule),
    },
    {
        path: "table",
        loadChildren: () => import("./visual/table/table-test.module").then(m => m.TableTestModule),
    },
];

@NgModule({
    imports: [
        TestCommonModule,
        RouterModule.forChild(routes),
    ],
})
export class DashboardTestModule { }
