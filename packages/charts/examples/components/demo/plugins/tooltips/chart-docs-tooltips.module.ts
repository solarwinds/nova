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

import { DemoCommonModule } from "../../common/demo-common.module";

import { BarChartWithTooltipsExampleComponent } from "./bar-chart/bar-chart-with-tooltips.example.component";
import { ChartDocsTooltipsComponent } from "./chart-docs-tooltips.component";
import { DonutChartWithTooltipsExampleComponent } from "./donut-chart/donut-chart-with-tooltips.example.component";
import { LineChartWithTooltipsExampleComponent } from "./line-chart/line-chart-with-tooltips.example.component";
import { TooltipsVisualTestComponent } from "./visual-test/tooltips-visual-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsTooltipsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "line",
        component: LineChartWithTooltipsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bar",
        component: BarChartWithTooltipsExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "visual-test",
        component: TooltipsVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BarChartWithTooltipsExampleComponent,
        ChartDocsTooltipsComponent,
        LineChartWithTooltipsExampleComponent,
        DonutChartWithTooltipsExampleComponent,
        TooltipsVisualTestComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
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
export class ChartDocsTooltipsModule {}
