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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ChartExampleIndexComponent } from "../../chart-example-index.component";

// To use polyfill you need to create an instance of it
// const i18n = new I18n("xlf", translationLibrary, "fr");
// And then data: i18n("Some string");

const appRoutes: Routes = [
    {
        path: "",
        component: ChartExampleIndexComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "advanced-usage",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/chart-docs-advanced-usage.module"
            ).then((m) => m.ChartDocsAdvancedUsageModule),
    },
    {
        path: "chart-types",
        loadChildren: async () =>
            import(
                "components/demo/chart-types/chart-docs-chart-types.module"
            ).then((m) => m.ChartDocsChartTypesModule),
    },
    {
        path: "time-frame-bar",
        loadChildren: async () =>
            import(
                "components/demo/time-frame-bar/chart-docs-time-frame-bar.module"
            ).then((m) => m.ChartDocsTimeFrameBarModule),
    },
    {
        path: "development",
        loadChildren: async () =>
            import(
                "components/demo/development/charts-development.module"
            ).then((m) => m.ChartsDevelopmentModule),
    },
    {
        path: "layout",
        loadChildren: async () =>
            import("components/demo/layout/chart-docs-layout.module").then(
                (m) => m.ChartDocsLayoutModule
            ),
    },
    {
        path: "plugins",
        loadChildren: async () =>
            import("components/demo/plugins/chart-docs-plugins.module").then(
                (m) => m.ChartDocsPluginsModule
            ),
    },
    {
        path: "thresholds",
        loadChildren: async () =>
            import(
                "components/demo/thresholds/chart-docs-thresholds.module"
            ).then((m) => m.ChartDocsThresholdsModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: true,
            relativeLinkResolution: "legacy",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
