import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule } from "@solarwinds/nova-bits";
import { NuiChartsModule } from "@solarwinds/nova-charts";

const exampleRoutes: Routes = [
    {
        path: "overview",
        loadChildren: () =>
            import("components/demo/advanced-usage/accessors/overview/chart-docs-accessors-overview.module").then(m => m.ChartDocsAccessorsOverviewModule),
    },
    {
        path: "data",
        loadChildren: () =>
            import("components/demo/advanced-usage/accessors/data/chart-docs-accessors-data.module").then(m => m.ChartDocsAccessorsDataModule),
    },
    {
        path: "colors",
        loadChildren: () =>
            import("components/demo/advanced-usage/accessors/colors/chart-docs-accessors-colors.module").then(m => m.ChartDocsAccessorsColorsModule),
    },
    {
        path: "markers",
        loadChildren: () =>
            import("components/demo/advanced-usage/accessors/markers/chart-docs-accessors-markers.module").then(m => m.ChartDocsAccessorsMarkersModule),
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
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsAccessorsModule {
}
