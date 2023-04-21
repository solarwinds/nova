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

enum TutorialsModuleRoute {
    HelloDashboards = "hello-dashboards",
    DataSource = "data-source-setup",
    WidgetEditor = "widget-editor-setup",
    SubmitHandler = "persistence-handler-setup",
    WidgetCreation = "widget-creation",
    Customization = "customization",
    WidgetErrorHandling = "widget-error-handling",
    DynamicHeaderLinks = "dynamic-header-links",
}

const routes: Routes = [
    {
        path: TutorialsModuleRoute.HelloDashboards,
        loadChildren: async () =>
            import(
                "./hello-dashboards/hello-dashboards.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.DataSource,
        loadChildren: async () =>
            import(
                "./data-source-setup/data-source-setup.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.WidgetEditor,
        loadChildren: async () =>
            import(
                "./widget-editor-setup/widget-editor-setup.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.SubmitHandler,
        loadChildren: async () =>
            import(
                "./persistence-handler-setup/persistence-handler-setup.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.WidgetCreation,
        loadChildren: async () =>
            import(
                "./widget-creation/widget-creation.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.Customization,
        loadChildren: async () =>
            import("./customization/customization.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: TutorialsModuleRoute.WidgetErrorHandling,
        loadChildren: async () =>
            import(
                "./widget-error-handling/widget-error-handling.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: TutorialsModuleRoute.DynamicHeaderLinks,
        loadChildren: async () =>
            import(
                "./dynamic-header-links/dynamic-header-links-docs.module"
            ) as object as Promise<Type<any>>,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [ConfiguratorHeadingService],
})
export default class TutorialsModule {}
