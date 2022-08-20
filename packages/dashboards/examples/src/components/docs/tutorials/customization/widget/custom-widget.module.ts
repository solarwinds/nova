import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiImageModule,
    NuiMessageModule,
    NuiSelectV2Module,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    NuiDashboardConfiguratorModule,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { CustomWidgetDocsComponent } from "./custom-widget-docs.component";
import {
    CustomConfiguratorSectionComponent,
    CustomWidgetBodyContentComponent,
    CustomWidgetComponent,
} from "./custom-widget.component";

const routes = [
    {
        path: "",
        component: CustomWidgetDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: CustomWidgetComponent,
        data: {
            srlc: {
                hideIndicator: true,
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
        NuiImageModule,
        NuiMessageModule,
        NuiSelectV2Module,
        NuiSwitchModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CustomWidgetDocsComponent,
        CustomConfiguratorSectionComponent,
        CustomWidgetBodyContentComponent,
        CustomWidgetComponent,
    ],
})
export class CustomWidgetModule {}
