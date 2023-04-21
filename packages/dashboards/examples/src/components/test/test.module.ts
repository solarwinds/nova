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
import { RouterModule } from "@angular/router";

import { TestCommonModule } from "./common/common.module";

const routes = [
    {
        path: "overview",
        loadChildren: async () =>
            import("./visual/overview/overview.module").then(
                (m) => m.OverviewModule
            ),
    },
    {
        path: "proportional",
        loadChildren: async () =>
            import(
                "./visual/proportional/proportional-widget-test.module"
            ).then((m) => m.ProportionalWidgetTestModule),
    },
    {
        path: "configurator",
        loadChildren: async () =>
            import("./visual/configurator/configurator-test.module").then(
                (m) => m.ConfiguratorTestModule
            ),
    },
    {
        path: "timeseries",
        loadChildren: async () =>
            import("./visual/timeseries/timeseries-test.module").then(
                (m) => m.TimeseriesTestModule
            ),
    },
    {
        path: "table",
        loadChildren: async () =>
            import("./visual/table/table-test.module").then(
                (m) => m.TableTestModule
            ),
    },
    {
        path: "kpi",
        loadChildren: async () =>
            import("./visual/kpi/kpi-widget-test.module").then(
                (m) => m.KpiWidgetTestModule
            ),
    },
    {
        path: "drilldown",
        loadChildren: async () =>
            import("./visual/drilldown/drilldown-widget-test.module").then(
                (m) => m.DrilldownWidgetTestModule
            ),
    },
];

@NgModule({
    imports: [TestCommonModule, RouterModule.forChild(routes)],
})
export default class DashboardTestModule {}
