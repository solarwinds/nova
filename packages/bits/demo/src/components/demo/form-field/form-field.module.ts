import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDatePickerModule,
    NuiDateTimerPickerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiRadioModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiTimePickerModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import { FormFieldBasicHintExampleComponent } from "./basic-hint/form-field-hint.example.component";
import { FormFieldBasicReactiveCustomValidationExampleComponent } from "./basic-reactive/basic-reactive-form-field-custom-validation.example.component";
import {
    FirstCustomFormExampleComponent,
    FormFieldBasicExampleComponent,
    FormFieldBasicReactiveExampleComponent,
    FormFieldComplexExampleComponent,
    FormFieldDynamicDisablingExampleComponent,
    FormFieldExampleComponent,
    FormFieldInFormExampleComponent,
    FormFieldTestComponent,
    FormFieldValidationTriggeringxampleComponent,
    FormFieldVisualTestComponent,
    FormFieldWithHTMLExampleComponent,
    NestedFormsAsComponentExampleComponent,
    SecondCustomFormExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: FormFieldExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "form-field-test",
        component: FormFieldTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "form-field-visual-test",
        component: FormFieldVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "form-field-validation-triggering",
        component: FormFieldValidationTriggeringxampleComponent,
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
        NuiFormFieldModule,
        NuiValidationMessageModule,
        NuiTextboxModule,
        FormsModule,
        ReactiveFormsModule,
        NuiSelectModule,
        NuiRadioModule,
        NuiIconModule,
        NuiDatePickerModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiDateTimerPickerModule,
        NuiTimePickerModule,
        NuiCheckboxModule,
        RouterModule.forChild(routes),
        NuiSelectV2Module,
    ],
    declarations: [
        FormFieldExampleComponent,
        FormFieldBasicExampleComponent,
        FormFieldBasicHintExampleComponent,
        FormFieldBasicReactiveExampleComponent,
        FormFieldBasicReactiveCustomValidationExampleComponent,
        FormFieldComplexExampleComponent,
        FormFieldDynamicDisablingExampleComponent,
        FormFieldInFormExampleComponent,
        FormFieldTestComponent,
        FormFieldVisualTestComponent,
        FormFieldWithHTMLExampleComponent,
        NestedFormsAsComponentExampleComponent,
        FirstCustomFormExampleComponent,
        SecondCustomFormExampleComponent,
        FormFieldValidationTriggeringxampleComponent,
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
export class FormFieldModule {
}
