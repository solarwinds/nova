import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

enum CustomizationModuleRoute {
    ConfiguratorSection = "configurator-section",
    Widget = "widget",
    Formatter = "formatter",
    DataSourceConfigurator = "data-source-configurator",
}

const routes: Routes = [
    {
        path: CustomizationModuleRoute.ConfiguratorSection,
        loadChildren: () => import("components/docs/tutorials/customization/configurator-section/custom-configurator-section.module")
            .then(m => m.CustomConfiguratorSectionModule),
    },
    {
        path: CustomizationModuleRoute.Widget,
        loadChildren: () => import("components/docs/tutorials/customization/widget/custom-widget.module")
            .then(m => m.CustomWidgetModule),
    },
    {
        path: CustomizationModuleRoute.Formatter,
        loadChildren: () => import("components/docs/tutorials/customization/formatter/custom-formatter.module")
            .then(m => m.CustomFormatterModuleRoute),
    },
    {
        path: CustomizationModuleRoute.DataSourceConfigurator,
        loadChildren: () => import("components/docs/tutorials/customization/data-source-configurator/custom-data-source-configurator.module")
            .then(m => m.CustomDataSourceConfiguratorModuleRoute),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
})
export class CustomizationModule { }
