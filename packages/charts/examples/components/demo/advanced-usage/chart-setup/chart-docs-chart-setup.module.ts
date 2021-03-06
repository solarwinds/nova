import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsChartSetupComponent } from "./chart-docs-chart-setup.component";
import { LineChartExampleComponent } from "./line-chart/line-chart.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsChartSetupComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "line-chart",
        component: LineChartExampleComponent,
    },
];

@NgModule({
    declarations: [
        LineChartExampleComponent,
        ChartDocsChartSetupComponent,
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
export class ChartDocsChartSetupModule {
}
