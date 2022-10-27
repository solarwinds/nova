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

import { DEMO_PATH_TOKEN, NuiDocsModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsScalesComponent } from "./chart-docs-scales.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsScalesComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "domains",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/scales/domains/chart-docs-domains.module"
            ).then((m) => m.ChartDocsDomainsModule),
    },
    {
        path: "formatters",
        loadChildren: async () =>
            import(
                "components/demo/advanced-usage/scales/formatters/chart-docs-formatters.module"
            ).then((m) => m.ChartDocsFormattersModule),
    },
];

@NgModule({
    declarations: [ChartDocsScalesComponent],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
})
export class ChartDocsScalesModule {}
