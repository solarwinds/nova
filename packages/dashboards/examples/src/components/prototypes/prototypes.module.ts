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
import { RouterModule } from "@angular/router";

import { ConfiguratorHeadingService } from "@nova-ui/dashboards";

import { AcmeComponentsModule } from "./components/components.module";

const routes = [
    {
        path: "prototype-1",
        loadChildren: async () =>
            import("../prototypes/prototype-1/prototype-1.module").then(
                (m) => m.Prototype1Module
            ),
    },
    {
        path: "timeseries",
        loadChildren: async () =>
            import(
                "../prototypes/timeseries/timeseries-widget-prototype.module"
            ).then((m) => m.TimeseriesWidgetPrototypeModule),
    },
    {
        path: "table",
        loadChildren: async () =>
            import("../prototypes/table/table-widget-prototype.module").then(
                (m) => m.TableWidgetPrototypeModule
            ),
    },
    {
        path: "many-widgets",
        loadChildren: async () =>
            import("../prototypes/many-widgets/many-widgets.module").then(
                (m) => m.ManyWidgetsModule
            ),
    },
];

@NgModule({
    imports: [
        CommonModule,
        AcmeComponentsModule,
        RouterModule.forChild(routes),
    ],
    providers: [ConfiguratorHeadingService],
})
export default class DashboardPrototypesModule {}
