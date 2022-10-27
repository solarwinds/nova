// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
