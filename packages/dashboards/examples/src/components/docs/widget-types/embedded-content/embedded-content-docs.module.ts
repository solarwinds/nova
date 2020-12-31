import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// tslint:disable-next-line:max-line-length
import { NuiButtonModule, NuiDocsModule, NuiMessageModule,  NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { EmbeddedContentDocsComponent } from "./embedded-content-docs.component";
import { EmbeddedContentWidgetExampleComponent } from "./embedded-content-widget-example/embedded-content-widget-example.component";


const routes: Routes = [
    {
        path: "",
        component: EmbeddedContentDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "example",
        component: EmbeddedContentWidgetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiDashboardsModule,
        NuiSwitchModule,
    ],
    declarations: [
        EmbeddedContentDocsComponent,
        EmbeddedContentWidgetExampleComponent,
    ],
})
export class EmbeddedContentDocsModule {
}
