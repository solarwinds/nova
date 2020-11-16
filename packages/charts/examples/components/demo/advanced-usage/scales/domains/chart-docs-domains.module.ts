import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiMessageModule, SrlcStage } from "@solarwinds/nova-bits";
import { NuiChartsModule } from "@solarwinds/nova-charts";

import { ChartDocsDomainsComponent } from "./chart-docs-domains.component";
import { FixedDomainsExampleComponent } from "./fixed-domains/fixed-domains.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsDomainsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsDomainsComponent,
        FixedDomainsExampleComponent,
    ],
    imports: [
        NuiButtonModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsDomainsModule {
}
