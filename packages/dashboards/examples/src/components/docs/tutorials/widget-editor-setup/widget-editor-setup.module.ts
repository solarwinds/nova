import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiButtonModule,  NuiDocsModule, NuiMenuModule, NuiMessageModule, NuiSwitchModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { WidgetEditorDocsComponent } from "./widget-editor-setup-docs.component";
import { WidgetEditorSetupComponent } from "./widget-editor-setup.component";

const routes = [
    {
        path: "",
        component: WidgetEditorDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: WidgetEditorSetupComponent,
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
        HttpClientModule,
        NuiDashboardsModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        WidgetEditorDocsComponent,
        WidgetEditorSetupComponent,
    ],
    entryComponents: [
    ],
})
export class WidgetEditorSetupModule { }
