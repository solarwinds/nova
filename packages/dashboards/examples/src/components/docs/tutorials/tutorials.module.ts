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
                "components/docs/tutorials/hello-dashboards/hello-dashboards.module"
            ).then((m) => m.HelloDashboardsModule),
    },
    {
        path: TutorialsModuleRoute.DataSource,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/data-source-setup/data-source-setup.module"
            ).then((m) => m.DataSourceSetupModule),
    },
    {
        path: TutorialsModuleRoute.WidgetEditor,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/widget-editor-setup/widget-editor-setup.module"
            ).then((m) => m.WidgetEditorSetupModule),
    },
    {
        path: TutorialsModuleRoute.SubmitHandler,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/persistence-handler-setup/persistence-handler-setup.module"
            ).then((m) => m.PersistenceHandlerSetupModule),
    },
    {
        path: TutorialsModuleRoute.WidgetCreation,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/widget-creation/widget-creation.module"
            ).then((m) => m.WidgetCreationModule),
    },
    {
        path: TutorialsModuleRoute.Customization,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/customization/customization.module"
            ).then((m) => m.CustomizationModule),
    },
    {
        path: TutorialsModuleRoute.WidgetErrorHandling,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/widget-error-handling/widget-error-handling.module"
            ).then((m) => m.WidgetErrorHandlingModule),
    },
    {
        path: TutorialsModuleRoute.DynamicHeaderLinks,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/dynamic-header-links/dynamic-header-links-docs.module"
            ).then((m) => m.DynamicHeaderLinksDocsModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [ConfiguratorHeadingService],
})
export class TutorialsModule {}
