import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiDocsModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

const routes: Routes = [
    {
        path: "kpi",
        loadChildren: () => import("components/docs/widget-types/kpi/kpi-docs.module").then(m => m.KpiDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "timeseries",
        loadChildren: () => import("components/docs/widget-types/timeseries/timeseries-docs.module").then(m => m.TimeseriesDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "table",
        loadChildren: () => import("components/docs/widget-types/table/table-docs.module").then(m => m.TableDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "proportional",
        loadChildren: () => import("components/docs/widget-types/proportional/proportional-docs.module").then(m => m.ProportionalDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "embedded",
        loadChildren: () => import("components/docs/widget-types/embedded-content/embedded-content-docs.module").then(m => m.EmbeddedContentDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "drilldown",
        loadChildren: () => import("components/docs/widget-types/drilldown/drilldown-docs.module").then(m => m.DrilldownDocsModule),
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiDocsModule,
        NuiDashboardsModule,
    ],
})
export class WidgetTypesModule {
}
