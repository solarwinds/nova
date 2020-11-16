import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

enum TutorialsModuleRoute {
    HelloDashboards = "hello-dashboards",
    DataSource = "data-source-setup",
    WidgetEditor = "widget-editor-setup",
    SubmitHandler = "persistence-handler-setup",
    WidgetCreation = "widget-creation",
    Customization = "customization",
 }

const routes: Routes = [
    {
        path: TutorialsModuleRoute.HelloDashboards,
        loadChildren: () => import("components/docs/tutorials/hello-dashboards/hello-dashboards.module").then(m => m.HelloDashboardsModule),
    },
    {
        path: TutorialsModuleRoute.DataSource,
        loadChildren: () => import("components/docs/tutorials/data-source-setup/data-source-setup.module").then(m => m.DataSourceSetupModule),
    },
    {
        path: TutorialsModuleRoute.WidgetEditor,
        loadChildren: () => import("components/docs/tutorials/widget-editor-setup/widget-editor-setup.module").then(m => m.WidgetEditorSetupModule),
    },
    {
        path: TutorialsModuleRoute.SubmitHandler,
        loadChildren: () => import("components/docs/tutorials/persistence-handler-setup/persistence-handler-setup.module")
            .then(m => m.PersistenceHandlerSetupModule),
    },
    {
        path: TutorialsModuleRoute.WidgetCreation,
        loadChildren: () => import("components/docs/tutorials/widget-creation/widget-creation.module")
            .then(m => m.WidgetCreationModule),
    },
    {
        path: TutorialsModuleRoute.Customization,
        loadChildren: () => import("components/docs/tutorials/customization/customization.module")
            .then(m => m.CustomizationModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
})
export class TutorialsModule { }
