import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule, NuiTableModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsSparkComponent } from "./chart-docs-spark.component";
import { SparkChartBasicExampleComponent } from "./spark-chart-basic/spark-chart-basic.example.component";
import { SparkChartLegendExampleComponent } from "./spark-chart-legend/spark-chart-legend.example.component";
import { SparkChartMultipleExampleComponent } from "./spark-chart-multiple/spark-chart-multiple.example.component";
import { SparkChartTableExampleComponent } from "./spark-chart-table/spark-chart-table.example.component";
import { SparkChartTestComponent } from "./spark-chart-test/spark-chart-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsSparkComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: SparkChartBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "legend",
        component: SparkChartLegendExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "multiple",
        component: SparkChartMultipleExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "table",
        component: SparkChartTableExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "test",
        component: SparkChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsSparkComponent,
        SparkChartBasicExampleComponent,
        SparkChartLegendExampleComponent,
        SparkChartMultipleExampleComponent,
        SparkChartTableExampleComponent,
        SparkChartTestComponent,
    ],
    imports: [
        FormsModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiTableModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsSparkModule {
}
