import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiImageModule, NuiMenuModule, NuiMessageModule, NuiRepeatModule, NuiSwitchModule, NuiToastModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { WidgetCreationDocsComponent } from "./widget-creation-docs.component";
import { WidgetCreationComponent, WidgetTemplateSelectionComponent } from "./widget-creation.component";

const routes = [
    {
        path: "",
        component: WidgetCreationDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: WidgetCreationComponent,
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
        NuiToastModule,
        NuiButtonModule,
        NuiRepeatModule,
        NuiImageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        WidgetCreationDocsComponent,
        WidgetCreationComponent,
        WidgetTemplateSelectionComponent,
    ],
    entryComponents: [
    ],
})
export class WidgetCreationModule { }
