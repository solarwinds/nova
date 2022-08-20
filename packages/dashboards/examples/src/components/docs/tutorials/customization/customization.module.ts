import { NgModule } from "@angular/core";
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
                "components/docs/tutorials/customization/configurator-section/custom-configurator-section.module"
            ).then((m) => m.CustomConfiguratorSectionModule),
    },
    {
        path: CustomizationModuleRoute.Widget,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/customization/widget/custom-widget.module"
            ).then((m) => m.CustomWidgetModule),
    },
    {
        path: CustomizationModuleRoute.Formatter,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/customization/formatter/custom-formatter.module"
            ).then((m) => m.CustomFormatterModuleRoute),
    },
    {
        path: CustomizationModuleRoute.DataSourceConfigurator,
        loadChildren: async () =>
            import(
                "components/docs/tutorials/customization/data-source-configurator/custom-data-source-configurator.module"
            ).then((m) => m.CustomDataSourceConfiguratorModuleRoute),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [ConfiguratorHeadingService],
})
export class CustomizationModule {}
