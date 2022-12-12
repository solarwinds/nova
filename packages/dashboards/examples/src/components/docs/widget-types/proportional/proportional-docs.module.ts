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

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { ProportionalDocsComponent } from "./proportional-docs.component";
import { ProportionalDonutContentDocsComponent } from "./proportional-donut-content-formatters/docs/proportional-donut-content-docs.component";
import { ProportionalWidgetDonutContentFormattersExampleComponent } from "./proportional-donut-content-formatters/example/proportional-donut-content-formatters-example.component";
import { ProportionalWidgetExampleComponent } from "./proportional-widget-example/proportional-widget-example.component";
import { ProportionalWidgetInteractiveExampleComponent } from "./proportional-widget-interactive-example/proportional-widget-interactive-example.component";

const routes: Routes = [
    {
        path: "",
        component: ProportionalDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: ProportionalWidgetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-content-formatters",
        component: ProportionalDonutContentDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "donut-content-formatters-example",
        component: ProportionalWidgetDonutContentFormattersExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "proportional-widget-interactive-example",
        component: ProportionalWidgetInteractiveExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiDashboardsModule,
        NuiMessageModule,
        NuiSwitchModule,
    ],
    declarations: [
        ProportionalDocsComponent,
        ProportionalWidgetExampleComponent,
        ProportionalWidgetInteractiveExampleComponent,
        ProportionalWidgetDonutContentFormattersExampleComponent,
        ProportionalDonutContentDocsComponent,
    ],
})
export default class ProportionalDocsModule {}
