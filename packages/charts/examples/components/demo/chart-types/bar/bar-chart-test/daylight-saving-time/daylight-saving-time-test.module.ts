import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiMessageModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../../../common/demo-common.module";
import { BarChartTimeIntervalDstTestComponent } from "./bar-chart-time-interval/bar-chart-time-interval-dst-test.component";
import { DstTestPageComponent } from "./dst-test-page.component";

@NgModule({
    declarations: [
        BarChartTimeIntervalDstTestComponent,
        DstTestPageComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiChartsModule,
        NuiIconModule,
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () =>  (<any> require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/)},
    ],
})
export class DaylightSavingTimeTestModule { }
