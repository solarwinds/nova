import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
// tslint:disable-next-line: max-line-length
import { NuiButtonModule, NuiDocsModule, NuiFormFieldModule, NuiIconModule, NuiMessageModule, NuiSelectV2Module, NuiSwitchModule, NuiTextboxModule, NuiValidationMessageModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { CustomDonutContentFormatterDocComponent } from "./donut-content-formatter-example/custom-donut-content-formatter-docs.component";
import { CustomDonutContentFormatterComponent, CustomDonutContentFormatterConfiguratorComponent, CustomDonutContentFormatterExampleComponent } from "./donut-content-formatter-example/custom-donut-content-formatter-example.component";
import { CustomFormatterDocComponent } from "./formatter-example/custom-formatter-docs.component";
import { CustomFormatterComponent, CustomFormatterConfiguratorComponent, CustomFormatterExampleComponent } from "./formatter-example/custom-formatter-example.component";

const routes: Routes = [
    {
        path: "table-formatter",
        component: CustomFormatterDocComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "donut-content-formatter",
        component: CustomDonutContentFormatterDocComponent,
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
        NuiDashboardsModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        NuiSwitchModule,
        NuiSelectV2Module,
        NuiValidationMessageModule,
        NuiIconModule,
        ReactiveFormsModule,
    ] ,
    declarations: [
        CustomDonutContentFormatterComponent,
        CustomDonutContentFormatterExampleComponent,
        CustomDonutContentFormatterConfiguratorComponent,
        CustomDonutContentFormatterDocComponent,
        CustomFormatterDocComponent,
        CustomFormatterExampleComponent,
        CustomFormatterConfiguratorComponent,
        CustomFormatterComponent,
    ],
})
export class CustomFormatterModuleRoute {
}
