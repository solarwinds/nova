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
    NuiMessageModule,
    NuiSwitchModule,
    NuiTextboxModule,
} from "@nova-ui/bits";
import {
    NuiDashboardConfiguratorModule,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { WidgetErrorHandlingDocsComponent } from "./widget-error-handling-docs.component";
import { WidgetErrorHandlingComponent } from "./widget-error-handling.component";

const routes = [
    {
        path: "",
        component: WidgetErrorHandlingDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: WidgetErrorHandlingComponent,
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
        NuiButtonModule,
        NuiDashboardsModule,
        NuiDashboardConfiguratorModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiIconModule,
        NuiMessageModule,
        NuiIconModule,
        NuiTextboxModule,
        NuiIconModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        WidgetErrorHandlingDocsComponent,
        WidgetErrorHandlingComponent,
    ],
    entryComponents: [],
})
export class WidgetErrorHandlingModule {}
