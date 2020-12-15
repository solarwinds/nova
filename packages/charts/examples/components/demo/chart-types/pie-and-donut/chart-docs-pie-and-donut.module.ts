import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiIconModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsPieAndDonutComponent } from "./chart-docs-pie-and-donut.component";
import { DonutChartInteractiveExampleComponent } from "./donut-chart-interactive/donut-chart-interactive.example.component";
import { DonutChartTestComponent } from "./donut-chart-test/donut-chart-test.component";
import { DonutChartWithContentExampleComponent } from "./donut-chart-with-content/donut-chart-with-content.example.component";
import { DonutChartExampleComponent } from "./donut-chart/donut-chart.example.component";
import { PieChartTestComponent } from "./pie-chart-test/pie-chart-test.component";
import { PieChartExampleComponent } from "./pie-chart/pie-chart.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsPieAndDonutComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "pie",
        component: PieChartExampleComponent,
    },
    {
        path: "donut-interactive",
        component: DonutChartInteractiveExampleComponent,
    },
    {
        path: "pie-test",
        component: PieChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "donut",
        component: DonutChartExampleComponent,
    },
    {
        path: "donut-with-content",
        component: DonutChartWithContentExampleComponent,
    },
    {
        path: "donut-test",
        component: DonutChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsPieAndDonutComponent,
        DonutChartExampleComponent,
        DonutChartWithContentExampleComponent,
        DonutChartInteractiveExampleComponent,
        DonutChartTestComponent,
        PieChartExampleComponent,
        PieChartTestComponent,
    ],
    imports: [
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsPieAndDonutModule {
}
