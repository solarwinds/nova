import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { LineChartTooltipsPrototypeComponent } from "./line-chart/line-chart-tooltips-prototype.component";
import { TooltipsPerformanceTestComponent } from "./line-chart/tooltips-performance-test.component";

const routes: Routes = [
    {
        path: "performance",
        component: TooltipsPerformanceTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        LineChartTooltipsPrototypeComponent,
        TooltipsPerformanceTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiIconModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
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
export class TooltipsPrototypeModule {}
