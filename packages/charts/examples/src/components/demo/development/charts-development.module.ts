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

import { NgModule, Type } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const chartsRoutes: Routes = [
    {
        path: "core",
        loadChildren: async () =>
            import("./core/core-example.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "pie",
        loadChildren: async () =>
            import("./pie-chart/pie-chart-example.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "bar",
        loadChildren: async () =>
            import("./bar/bar-prototype.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "collection",
        loadChildren: async () =>
            import(
                "./chart-collection/chart-collection-example.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "popovers",
        loadChildren: async () =>
            import("./popovers/popovers-prototype.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "tooltips",
        loadChildren: async () =>
            import("./tooltips/tooltips-prototype.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "spark",
        loadChildren: async () =>
            import("./spark/spark-prototype.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "gauge",
        loadChildren: async () =>
            import("./gauge/gauge-prototypes.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "type-switch",
        loadChildren: async () =>
            import(
                "./type-switch/type-switch-example.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "status",
        loadChildren: async () =>
            import("./status/chart-status-example.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "time-bands",
        loadChildren: async () =>
            import(
                "./time-bands/time-bands-example.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "data-point-selection",
        loadChildren: async () =>
            import(
                "./data-point-selection/data-point-selection-prototype.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "thresholds",
        loadChildren: async () =>
            import(
                "./thresholds/thresholds-prototype.module"
            ) as object as Promise<Type<any>>,
    },
];

@NgModule({
    imports: [RouterModule.forChild(chartsRoutes)],
})
export default class ChartsDevelopmentModule {}
