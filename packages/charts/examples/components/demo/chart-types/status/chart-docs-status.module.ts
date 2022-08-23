import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsStatusComponent } from "./chart-docs-status.component";
import { StatusChartExampleComponent } from "./status-chart/status-chart.example.component";
import { StatusLegendChartExampleComponent } from "./status-legend-chart/status-legend-chart.example.component";
import { StatusChartTestComponent } from "./status-test/status-chart-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsStatusComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: StatusChartExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "legend",
        component: StatusLegendChartExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: StatusChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsStatusComponent,
        StatusChartExampleComponent,
        StatusLegendChartExampleComponent,
        StatusChartTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
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
export class ChartDocsStatusModule {}
