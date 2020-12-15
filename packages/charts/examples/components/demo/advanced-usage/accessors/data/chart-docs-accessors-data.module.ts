import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { RendererAccessorsExampleComponent } from "./accessors/accessors.example.component";
import { ChartDocsAccessorsDataComponent } from "./chart-docs-accessors-data.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsAccessorsDataComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "accessors",
        component: RendererAccessorsExampleComponent,
    },
];

@NgModule({
    declarations: [
        RendererAccessorsExampleComponent,
        ChartDocsAccessorsDataComponent,
    ],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsAccessorsDataModule {
}
