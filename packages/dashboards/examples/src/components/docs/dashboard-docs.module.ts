import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule } from "@nova-ui/bits";

const exampleRoutes: Routes = [
    {
        path: "overview",
        loadChildren: () => import("components/docs/overview/overview.module").then(m => m.OverviewModule),
    },
    {
        path: "tutorials",
        loadChildren: () => import("components/docs/tutorials/tutorials.module").then(m => m.TutorialsModule),
    },
    {
        path: "widget-types",
        loadChildren: () => import("components/docs/widget-types/widget-types.module").then(m => m.WidgetTypesModule),
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class DashboardDocsModule {
}
