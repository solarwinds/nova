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

import { BarChartWithPopoverExampleComponent } from "./bar-chart/bar-chart-with-popover.example.component";
import { ChartDocsPopoversComponent } from "./chart-docs-popovers.component";
import { DonutChartWithPopoverExampleComponent } from "./donut-chart/donut-chart-with-popover.example.component";
import { LineChartWithPopoverExampleComponent } from "./line-chart/line-chart-with-popover.example.component";
import { PopoverVisualTestComponent } from "./popover-visual-test/popover-visual-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsPopoversComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "bar",
        component: BarChartWithPopoverExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "line",
        component: LineChartWithPopoverExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "visual-test",
        component: PopoverVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BarChartWithPopoverExampleComponent,
        DonutChartWithPopoverExampleComponent,
        ChartDocsPopoversComponent,
        LineChartWithPopoverExampleComponent,
        PopoverVisualTestComponent,
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
export class ChartDocsPopoversModule {}
