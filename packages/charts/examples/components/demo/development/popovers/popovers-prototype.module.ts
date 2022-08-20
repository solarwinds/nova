import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { DataPointPopoversPrototypeComponent } from "./data-point/data-point-popovers-prototype.component";
import { LineChartPopoverPrototypeComponent } from "./line-chart/line-chart-popover-prototype.component";
import { PopoverPerformanceTestComponent } from "./line-chart/popover-performance-test.component";

const routes: Routes = [
    {
        path: "line",
        component: LineChartPopoverPrototypeComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "performance",
        component: PopoverPerformanceTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "data-point",
        component: DataPointPopoversPrototypeComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
];

@NgModule({
    declarations: [
        LineChartPopoverPrototypeComponent,
        DataPointPopoversPrototypeComponent,
        PopoverPerformanceTestComponent,
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
export class PopoversPrototypeModule {}
