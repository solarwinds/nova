import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiRadioModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    WizardAdditionalButtonExampleComponent,
    WizardBusyExampleComponent,
    WizardConfirmationDialogExampleComponent,
    WizardConstantHeightExampleComponent,
    WizardCustomStepLineWidthComponent,
    WizardDialogExampleComponent,
    WizardDisabledExampleComponent,
    WizardDynamicExampleComponent,
    WizardExampleComponent,
    WizardHiddenExampleComponent,
    WizardSimpleExampleComponent,
    WizardValidationExampleComponent,
    WizardVisualTestComponent,
    WizardDynamicRemoveExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: WizardExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "wizard-test",
        component: WizardExampleComponent,
    },
    {
        path: "wizard-visual-test",
        component: WizardVisualTestComponent,
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
        NuiWizardModule,
        NuiMessageModule,
        NuiDocsModule,
        NuiTextboxModule,
        NuiRadioModule,
        NuiCheckboxModule,
        NuiDialogModule,
        NuiValidationMessageModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        WizardAdditionalButtonExampleComponent,
        WizardBusyExampleComponent,
        WizardConfirmationDialogExampleComponent,
        WizardConstantHeightExampleComponent,
        WizardDialogExampleComponent,
        WizardDisabledExampleComponent,
        WizardDynamicExampleComponent,
        WizardExampleComponent,
        WizardHiddenExampleComponent,
        WizardSimpleExampleComponent,
        WizardValidationExampleComponent,
        WizardVisualTestComponent,
        WizardCustomStepLineWidthComponent,
        WizardDynamicRemoveExampleComponent,
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
export class WizardModule {
}
