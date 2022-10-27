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
import { InMemoryCache } from "@apollo/client/core";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";

import { APOLLO_API_NAMESPACE } from "./types";

const COUNTRIES_API = "https://countries-274616.ew.r.appspot.com/";

const exampleRoutes: Routes = [
    {
        path: "overview",
        loadChildren: async () =>
            import("components/docs/overview/overview.module").then(
                (m) => m.OverviewModule
            ),
    },
    {
        path: "tutorials",
        loadChildren: async () =>
            import("components/docs/tutorials/tutorials.module").then(
                (m) => m.TutorialsModule
            ),
    },
    {
        path: "widget-types",
        loadChildren: async () =>
            import("components/docs/widget-types/widget-types.module").then(
                (m) => m.WidgetTypesModule
            ),
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiMessageModule,
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
export class DashboardDocsModule {
    constructor(httpLink: HttpLink, apollo: Apollo) {
        apollo.createNamed(APOLLO_API_NAMESPACE.COUNTRIES, {
            link: httpLink.create({ uri: COUNTRIES_API }),
            cache: new InMemoryCache(),
        });
    }
}
