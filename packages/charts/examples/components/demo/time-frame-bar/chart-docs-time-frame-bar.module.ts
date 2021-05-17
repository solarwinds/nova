import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN, NuiBusyModule, NuiButtonModule, NuiCommonModule, NuiDialogModule, NuiDocsModule, NuiIconModule, NuiLayoutModule, NuiPopoverModule,
    NuiTimeFrameBarModule, NuiTimeFramePickerModule, NuiTooltipModule, SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../common/demo-common.module";

import { ChartDocsTimeFrameBarComponent } from "./chart-docs-time-frame-bar.component";
import { TimeFrameBarBasicExampleComponent } from "./time-frame-bar-basic/time-frame-bar-basic.example.component";
import { TimeFrameBarTestComponent } from "./time-frame-bar-test/time-frame-bar-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsTimeFrameBarComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: TimeFrameBarBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "test",
        component: TimeFrameBarTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsTimeFrameBarComponent,
        TimeFrameBarBasicExampleComponent,
        TimeFrameBarTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiBusyModule,
        NuiChartsModule,
        NuiCommonModule,
        NuiDialogModule,
        NuiDocsModule,
        NuiIconModule,
        NuiLayoutModule,
        NuiPopoverModule,
        NuiTimeFramePickerModule,
        NuiTimeFrameBarModule,
        NuiTooltipModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsTimeFrameBarModule {
}
