import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "test",
        loadChildren: () => import("../test/test.module").then(m => m.DashboardTestModule),
    },
    {
        path: "prototypes",
        loadChildren: () => import("../prototypes/prototypes.module").then(m => m.DashboardPrototypesModule),
    },
    {
        path: "schematics",
        loadChildren: () => import("../schematics/schematics-docs.module").then(m => m.SchematicsDocsModule),
    },
    {
        path: "docs",
        loadChildren: () => import("../docs/dashboard-docs.module").then(m => m.DashboardDocsModule),
    },
];


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule {
}
