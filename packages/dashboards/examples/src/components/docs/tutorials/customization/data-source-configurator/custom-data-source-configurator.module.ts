import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
// eslint-disable-next-line max-len
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
} from "@nova-ui/bits";
import {
    NuiDashboardConfiguratorModule,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { CustomDataSourceConfiguratorDocComponent } from "./custom-data-source-configurator-docs.component";
import {
    CustomDataSourceConfiguratorExampleComponent,
    HarryPotterDataSourceConfiguratorComponent,
} from "./example/custom-data-source-configurator-example.component";

const routes: Routes = [
    {
        path: "",
        component: CustomDataSourceConfiguratorDocComponent,
        data: {
            srlc: {
                hideIndicator: true,
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
        CustomDataSourceConfiguratorExampleComponent,
        HarryPotterDataSourceConfiguratorComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
})
export class CustomDataSourceConfiguratorModuleRoute {}
