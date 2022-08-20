import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DeveloperQuickLinksComponent } from "./prototype-index.component";

const appRoutes: Routes = [
    {
        path: "",
        component: DeveloperQuickLinksComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        loadChildren: async () =>
            import("../test/test.module").then((m) => m.DashboardTestModule),
    },
    {
        path: "prototypes",
        loadChildren: async () =>
            import("../prototypes/prototypes.module").then(
                (m) => m.DashboardPrototypesModule
            ),
    },
    {
        path: "schematics",
        loadChildren: async () =>
            import("../schematics/schematics-docs.module").then(
                (m) => m.SchematicsDocsModule
            ),
    },
    {
        path: "docs",
        loadChildren: async () =>
            import("../docs/dashboard-docs.module").then(
                (m) => m.DashboardDocsModule
            ),
    },
];

@NgModule({
    declarations: [DeveloperQuickLinksComponent],
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes, {
            useHash: true,
            relativeLinkResolution: "legacy",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
