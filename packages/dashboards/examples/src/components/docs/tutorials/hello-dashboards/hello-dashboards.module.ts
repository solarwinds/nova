import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { HelloDashboardsDocsComponent } from "./hello-dashboards-docs.component";
import { HelloDashboardsExampleComponent } from "./hello-dashboards.example.component";

const routes = [
    {
        path: "",
        component: HelloDashboardsDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: HelloDashboardsExampleComponent,
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
        NuiDashboardsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        HelloDashboardsDocsComponent,
        HelloDashboardsExampleComponent,
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
export class HelloDashboardsModule {}
