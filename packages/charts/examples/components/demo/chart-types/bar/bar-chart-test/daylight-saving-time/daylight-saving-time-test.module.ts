import { NgModule } from "@angular/core";
import { DEMO_PATH_TOKEN, NuiDocsModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../../../common/demo-common.module";
import { ChartDocsBarModule } from "../../chart-docs-bar.module";
import { BarChartTimeIntervalDstTestComponent } from "./bar-chart-time-interval/bar-chart-time-interval-dst-test.component";
import { DstTimeIntervalTestPageComponent } from "./dst-time-interval-test-page.component";

@NgModule({
    imports: [
        DemoCommonModule,
        NuiDocsModule,
        NuiChartsModule,
        ChartDocsBarModule,
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () =>  (<any> require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/)},
    ],
})
export class DaylightSavingTimeTestModule { }
