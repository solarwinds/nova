import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDatePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiSpinnerModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardV2Module,
    SrlcStage,
} from "@nova-ui/bits";

import {
    WizardBusyExampleComponent,
    WizardCustomComponent,
    WizardCustomExampleComponent,
    WizardCustomFooterExampleComponent,
    WizardDialogExampleComponent,
    WizardDocsComponent,
    WizardDynamicExampleComponent,
    WizardHorizontalExampleComponent,
    WizardVerticalExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: WizardDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.alpha,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
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
        NuiWizardV2Module,
        NuiSpinnerModule,
        NuiBusyModule,
        NuiProgressModule,
        NuiDatePickerModule,
    ],
    declarations: [
        WizardDocsComponent,
        WizardHorizontalExampleComponent,
        WizardVerticalExampleComponent,
        WizardCustomExampleComponent,
        WizardCustomComponent,
        WizardDialogExampleComponent,
        WizardBusyExampleComponent,
        WizardCustomFooterExampleComponent,
        WizardDynamicExampleComponent,
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
export class WizardModule {}
