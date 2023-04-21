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

import { ConfiguratorHeadingService } from "@nova-ui/dashboards";

enum CustomizationModuleRoute {
    ConfiguratorSection = "configurator-section",
    Widget = "widget",
    Formatter = "formatter",
    DataSourceConfigurator = "data-source-configurator",
}

const routes: Routes = [
    {
        path: CustomizationModuleRoute.ConfiguratorSection,
        loadChildren: async () =>
            import(
                "./configurator-section/custom-configurator-section.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: CustomizationModuleRoute.Widget,
        loadChildren: async () =>
            import("./widget/custom-widget.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: CustomizationModuleRoute.Formatter,
        loadChildren: async () =>
            import("./formatter/custom-formatter.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: CustomizationModuleRoute.DataSourceConfigurator,
        loadChildren: async () =>
            import(
                "./data-source-configurator/custom-data-source-configurator.module"
            ) as object as Promise<Type<any>>,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [ConfiguratorHeadingService],
})
export default class CustomizationModule {}
