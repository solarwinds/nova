import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDatePickerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiSelectModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    DatePickerBasicExampleComponent,
    DatePickerCalendarNavigatedExampleComponent,
    DatePickerCurrentMonthExampleComponent,
    DatePickerDateRangeExampleComponent,
    DatePickerDisableDateExampleComponent,
    DatePickerDisabledExampleComponent,
    DatePickerDocsComponent,
    DatePickerFirstDateOfWeekExampleComponent,
    DatePickerFormattingExampleComponent,
    DatePickerInitDateExampleComponent,
    DatePickerInitModeExampleComponent,
    DatePickerInlineExampleComponent,
    DatePickerInsignificantExampleComponent,
    DatePickerModesRangeExampleComponent,
    DatePickerReactiveFormExampleComponent,
    DatePickerShowWeeksExampleComponent,
    DatePickerTestComponent,
    DatePickerTimezoneExampleComponent,
    DatePickerValueChangeExampleComponent,
    DatePickerVisualTestComponent,
    DatePickerWithErrorExampleComponent,
    DatePickerYearRangeExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: DatePickerDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "date-picker-test",
        component: DatePickerTestComponent,
    },
    {
        path: "date-picker-visual-test",
        component: DatePickerVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiDatePickerModule,
        NuiSelectModule,
        NuiFormFieldModule,
        NuiValidationMessageModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DatePickerBasicExampleComponent,
        DatePickerCurrentMonthExampleComponent,
        DatePickerDateRangeExampleComponent,
        DatePickerDisableDateExampleComponent,
        DatePickerDisabledExampleComponent,
        DatePickerDocsComponent,
        DatePickerFirstDateOfWeekExampleComponent,
        DatePickerFormattingExampleComponent,
        DatePickerInitDateExampleComponent,
        DatePickerInitModeExampleComponent,
        DatePickerInlineExampleComponent,
        DatePickerInsignificantExampleComponent,
        DatePickerModesRangeExampleComponent,
        DatePickerShowWeeksExampleComponent,
        DatePickerValueChangeExampleComponent,
        DatePickerWithErrorExampleComponent,
        DatePickerYearRangeExampleComponent,
        DatePickerTestComponent,
        DatePickerVisualTestComponent,
        DatePickerCalendarNavigatedExampleComponent,
        DatePickerReactiveFormExampleComponent,
        DatePickerTimezoneExampleComponent,
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
    exports: [RouterModule],
})
export class DatePickerModule {}
