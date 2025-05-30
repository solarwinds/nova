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
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiDocsModule,
    NuiMessageModule,
    DEMO_PATH_TOKEN,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { DataSourceDocsComponent } from "./data-source-setup-docs.component";
import { DataSourceSetupComponent } from "./data-source-setup.component";
import { getDemoFiles } from "../../../../demo-files-factory";

const routes = [
    {
        path: "",
        component: DataSourceDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: DataSourceSetupComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        NuiDashboardsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [DataSourceDocsComponent, DataSourceSetupComponent],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("data-source-setup"),
        },
    ],
})
export default class DataSourceSetupModule {}
