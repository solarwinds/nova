import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDateTimerPickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiSelectModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    DateTimePickerBasicExampleComponent,
    DateTimePickerDialogExampleComponent,
    DateTimePickerDisabledExampleComponent,
    DateTimePickerDocsComponent,
    DateTimePickerEmptyStateComponent,
    DateTimePickerInlineExampleComponent,
    DateTimePickerRangeValuesExampleComponent,
    DateTimePickerReactiveFormExampleComponent,
    DateTimePickerTestComponent,
    DateTimePickerTimezonesExampleComponent,
    DateTimePickerVisualTestComponent,
} from "./index";


const routes = [
    {
        path: "",
        component: DateTimePickerDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "date-time-picker-test",
        component: DateTimePickerTestComponent,
    },
    {
        path: "date-time-picker-visual-test",
        component: DateTimePickerVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "dialog",
        component: DateTimePickerDialogExampleComponent,
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
        NuiDateTimerPickerModule,
        NuiDialogModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiSelectModule,
        NuiValidationMessageModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiDialogModule,
    ],
    declarations: [
        DateTimePickerTestComponent,
        DateTimePickerBasicExampleComponent,
        DateTimePickerInlineExampleComponent,
        DateTimePickerDisabledExampleComponent,
        DateTimePickerRangeValuesExampleComponent,
        DateTimePickerVisualTestComponent,
        DateTimePickerDocsComponent,
        DateTimePickerReactiveFormExampleComponent,
        DateTimePickerEmptyStateComponent,
        DateTimePickerTimezonesExampleComponent,
        DateTimePickerDialogExampleComponent,
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
export class DateTimePickerModule {
}
