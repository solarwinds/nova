import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN, NuiButtonModule, NuiCommonModule, NuiDatePickerModule, NuiDialogModule, NuiDocsModule, NuiIconModule, NuiMessageModule,
    NuiPopoverModule, NuiTimeFrameBarModule, NuiTimeFramePickerModule, NuiTimePickerModule, NuiTooltipModule, SrlcStage
} from "@solarwinds/nova-bits";

import { TimeFrameBarBasicExampleComponent } from "./time-frame-bar-basic/time-frame-bar-basic.example.component";
import { TimeFrameBarDocsExampleComponent } from "./time-frame-bar-docs/time-frame-bar-docs.example.component";
import { TimeFrameBarTestComponent } from "./time-frame-bar-test/time-frame-bar-test.component";
import { TimeFrameBarVisualTestComponent } from "./time-frame-bar-visual/time-frame-bar-visual.component";
import { TimeFrameBarZoomExampleComponent } from "./time-frame-bar-zoom/time-frame-bar-zoom.example.component";

const routes = [
    {
        path: "",
        component: TimeFrameBarDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: TimeFrameBarBasicExampleComponent,
    },
    {
        path: "zoom",
        component: TimeFrameBarZoomExampleComponent,
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
    {
        path: "visual",
        component: TimeFrameBarVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiCommonModule,
        NuiDatePickerModule,
        NuiDialogModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiPopoverModule,
        NuiTimeFramePickerModule,
        NuiTimePickerModule,
        NuiTooltipModule,
        NuiTimeFrameBarModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TimeFrameBarBasicExampleComponent,
        TimeFrameBarZoomExampleComponent,
        TimeFrameBarDocsExampleComponent,
        TimeFrameBarTestComponent,
        TimeFrameBarVisualTestComponent,
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
    exports: [
        RouterModule,
    ],
})
export class TimeFrameBarModule { }
