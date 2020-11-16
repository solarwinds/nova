import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
// tslint:disable-next-line: max-line-length
import { NuiButtonModule, NuiDocsModule, NuiFormFieldModule, NuiIconModule, NuiMessageModule, NuiSelectV2Module, NuiSwitchModule, NuiTextboxModule, NuiValidationMessageModule } from "@solarwinds/nova-bits";
import { NuiDashboardConfiguratorModule, NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { CustomDataSourceConfiguratorDocComponent } from "./custom-data-source-configurator-docs.component";
import { CustomDataSourceConfiguratorComponent, HarryPotterDataSourceConfiguratorComponent } from "./example/custom-data-source-configurator-example.component";

const routes: Routes = [
    {
        path: "",
        component: CustomDataSourceConfiguratorDocComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiDashboardConfiguratorModule,
        NuiDashboardsModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        NuiSwitchModule,
        NuiSelectV2Module,
        NuiValidationMessageModule,
        NuiIconModule,
        ReactiveFormsModule,
    ],
    declarations: [
        CustomDataSourceConfiguratorDocComponent,
        CustomDataSourceConfiguratorComponent,
        HarryPotterDataSourceConfiguratorComponent,
    ],
})
export class CustomDataSourceConfiguratorModuleRoute {
}
