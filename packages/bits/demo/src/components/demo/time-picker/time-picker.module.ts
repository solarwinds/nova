import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDateTimerPickerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTimePickerModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    TimePickerBasicExampleComponent,
    TimePickerCustomFormatExampleComponent,
    TimePickerCustomStepExampleComponent,
    TimePickerDisabledExampleComponent,
    TimePickerDocsExampleComponent,
    TimePickerLocalizedExampleComponent,
    TimePickerModelChangeExampleComponent,
    TimePickerPreserveInsignificantExampleComponent,
    TimePickerReactiveFormExampleComponent,
    TimePickerVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TimePickerDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "localized",
        component: TimePickerLocalizedExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "time-picker-visual-test",
        component: TimePickerVisualTestComponent,
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
        NuiTimePickerModule,
        FormsModule,
        NuiFormFieldModule,
        ReactiveFormsModule,
        NuiDocsModule,
        NuiIconModule,
        NuiTimeFrameBarModule,
        NuiDateTimerPickerModule,
        NuiTimeFramePickerModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TimePickerBasicExampleComponent,
        TimePickerCustomFormatExampleComponent,
        TimePickerCustomStepExampleComponent,
        TimePickerDisabledExampleComponent,
        TimePickerDocsExampleComponent,
        TimePickerLocalizedExampleComponent,
        TimePickerModelChangeExampleComponent,
        TimePickerPreserveInsignificantExampleComponent,
        TimePickerReactiveFormExampleComponent,
        TimePickerVisualTestComponent,
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
export class TimePickerModule {
}
