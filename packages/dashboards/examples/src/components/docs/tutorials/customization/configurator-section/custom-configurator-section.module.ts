import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NuiButtonModule,  NuiDocsModule, NuiFormFieldModule, NuiIconModule, NuiMessageModule, NuiSwitchModule, NuiTextboxModule } from "@solarwinds/nova-bits";
import { NuiDashboardConfiguratorModule, NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { CustomConfiguratorSectionDocsComponent } from "./custom-configurator-section-docs.component";
import { CustomConfiguratorSectionComponent, CustomKpiDescriptionConfigurationComponent } from "./custom-configurator-section.component";

const routes = [
    {
        path: "",
        component: CustomConfiguratorSectionDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: CustomConfiguratorSectionComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        NuiDashboardsModule,
        NuiDashboardConfiguratorModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiIconModule,
        NuiMessageModule,
        NuiSwitchModule,
        NuiTextboxModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CustomConfiguratorSectionDocsComponent,
        CustomKpiDescriptionConfigurationComponent,
        CustomConfiguratorSectionComponent,
    ],
})
export class CustomConfiguratorSectionModule { }
