import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../common/demo-common.module";

import { ChartDocsThresholdsComponent } from "./chart-docs-thresholds.component";
import { ThresholdsBasicExampleComponent } from "./thresholds-basic/thresholds-basic.example.component";
import { ThresholdsSparkExampleComponent } from "./thresholds-spark/thresholds-spark.example.component";
import { ThresholdsSummaryExampleComponent } from "./thresholds-summary/thresholds-summary-example/thresholds-summary.example.component";
import { ThresholdsSummaryTestHarnessComponent } from "./thresholds-summary/thresholds-summary-test-harness/thresholds-summary-test-harness.component";
import { ThresholdsSummaryTestComponent } from "./thresholds-summary/thresholds-summary-test/thresholds-summary-test.component";
import { ThresholdsSummaryVisualTestComponent } from "./thresholds-summary/thresholds-summary-visual-test/thresholds-summary-visual-test.component";
// eslint-disable-next-line max-len
import { ThresholdsSummaryWithIntervalScaleTestComponent } from "./thresholds-summary/thresholds-summary-with-interval-scale-test/thresholds-summary-with-interval-scale-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsThresholdsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: ThresholdsBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "spark",
        component: ThresholdsSparkExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary",
        component: ThresholdsSummaryExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary-test",
        component: ThresholdsSummaryTestHarnessComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "summary-visual-test",
        component: ThresholdsSummaryVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsThresholdsComponent,
        ThresholdsBasicExampleComponent,
        ThresholdsSparkExampleComponent,
        ThresholdsSummaryExampleComponent,
        ThresholdsSummaryTestComponent,
        ThresholdsSummaryTestHarnessComponent,
        ThresholdsSummaryVisualTestComponent,
        ThresholdsSummaryWithIntervalScaleTestComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiIconModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
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
export class ChartDocsThresholdsModule {}
