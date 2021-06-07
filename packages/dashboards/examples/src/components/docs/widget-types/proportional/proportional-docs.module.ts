import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { ProportionalDocsComponent } from "./proportional-docs.component";
import { ProportionalDonutContentDocsComponent } from "./proportional-donut-content-formatters/docs/proportional-donut-content-docs.component";
import { ProportionalWidgetDonutContentFormattersExampleComponent } from "./proportional-donut-content-formatters/example/proportional-donut-content-formatters-example.component";
import { ProportionalWidgetExampleComponent } from "./proportional-widget-example/proportional-widget-example.component";
import { ProportionalWidgetInteractiveExampleComponent } from "./proportional-widget-interactive-example/proportional-widget-interactive-example.component";


const routes: Routes = [
    {
        path: "",
        component: ProportionalDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: ProportionalWidgetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-content-formatters",
        component: ProportionalDonutContentDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut-content-formatters-example",
        component: ProportionalWidgetDonutContentFormattersExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "proportional-widget-interactive-example",
        component: ProportionalWidgetInteractiveExampleComponent,
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
        NuiDashboardsModule,
        NuiMessageModule,
        NuiSwitchModule,
    ],
    declarations: [
        ProportionalDocsComponent,
        ProportionalWidgetExampleComponent,
        ProportionalWidgetInteractiveExampleComponent,
        ProportionalWidgetDonutContentFormattersExampleComponent,
        ProportionalDonutContentDocsComponent,
    ],
})
export class ProportionalDocsModule {
}
