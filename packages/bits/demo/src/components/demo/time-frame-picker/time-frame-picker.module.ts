import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDatePickerModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiPopoverModule,
    NuiTextboxModule,
    NuiTimeFramePickerModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    QuickPickerBasicExampleComponent,
    TimeFramePickerBasicExampleComponent,
    TimeFramePickerCustomExampleComponent,
    TimeFramePickerDateExampleComponent,
    TimeFramePickerDocsExampleComponent,
    TimeFramePickerInlineExampleComponent,
    TimeFramePickerMultipleCustomPickersExampleComponent,
    TimeFramePickerTestExampleComponent,
    TimeFramePickerVisualTestComponent,
    TimeframeServiceScoperExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TimeFramePickerDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "time-frame-picker-test",
        component: TimeFramePickerTestExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "time-frame-picker-visual-test",
        component: TimeFramePickerVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "multiple-custom-pickers",
        component: TimeFramePickerMultipleCustomPickersExampleComponent,
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
        NuiTimeFramePickerModule,
        NuiDividerModule,
        NuiMessageModule,
        FormsModule,
        NuiPopoverModule,
        NuiDocsModule,
        NuiTextboxModule,
        RouterModule.forChild(routes),
        NuiDialogModule,
        NuiDatePickerModule,
    ],
    declarations: [
        QuickPickerBasicExampleComponent,
        TimeFramePickerBasicExampleComponent,
        TimeFramePickerCustomExampleComponent,
        TimeFramePickerDateExampleComponent,
        TimeFramePickerInlineExampleComponent,
        TimeFramePickerTestExampleComponent,
        TimeFramePickerDocsExampleComponent,
        TimeFramePickerVisualTestComponent,
        TimeFramePickerMultipleCustomPickersExampleComponent,
        TimeframeServiceScoperExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class TimeFramePickerModule {
}
