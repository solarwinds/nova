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
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    NuiFormFieldModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    DEMO_PATH_TOKEN,
} from "@nova-ui/bits";
import { NuiDashboardViewsModule } from "@nova-ui/dashboards";

import { getDemoFiles } from "../../../../demo-files-factory";
import { KpiTileViewBasicExampleComponent } from "./kpi-tile-view-basic/kpi-tile-view-basic-example.component";
import { KpiTileViewInteractiveExampleComponent } from "./kpi-tile-view-interactive/kpi-tile-view-interactive-example.component";
import { ProportionalChartViewPlaygroundExampleComponent } from "./proportional-chart-view-playground/proportional-chart-view-playground-example.component";
import { ViewComponentsDocsComponent } from "./view-components-docs.component";

const routes: Routes = [
    {
        path: "",
        component: ViewComponentsDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "kpi-tile-view-basic",
        component: KpiTileViewBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "proportional-chart-view-playground",
        component: ProportionalChartViewPlaygroundExampleComponent,
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
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NuiDocsModule,
        NuiMessageModule,
        NuiIconModule,
        NuiFormFieldModule,
        NuiSelectV2Module,
        NuiSwitchModule,
        NuiDashboardViewsModule,
    ],
    declarations: [
        ViewComponentsDocsComponent,
        KpiTileViewBasicExampleComponent,
        KpiTileViewInteractiveExampleComponent,
        ProportionalChartViewPlaygroundExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("view-components"),
        },
    ],
})
export default class ViewComponentsDocsModule {}
