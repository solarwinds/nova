import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiMessageModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { BarChartTimeIntervalExampleComponent } from "./bar-chart-time-interval/bar-chart-time-interval.example.component";
import { DstTestPageComponent } from "./dst-test-page.component";


const routes: Routes = [
    {
        path: "",
        component: DstTestPageComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BarChartTimeIntervalExampleComponent,
        DstTestPageComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiChartsModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () =>  (<any> require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/)},
    ],
})
export class DaylightSavingTimePrototypeModule {
}
