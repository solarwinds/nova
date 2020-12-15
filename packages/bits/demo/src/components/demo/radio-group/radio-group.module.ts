import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiRadioModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    BasicRadioGroupExampleComponent,
    DisabledRadioGroupExampleComponent,
    RadioGroupDocsExampleComponent,
    RadioGroupHintsExampleComponent,
    RadioGroupInFormExampleComponent,
    RadioGroupInlineExampleComponent,
    RadioGroupTestComponent,
    RadioGroupVisualTestComponent,
    ValueChangeRadioGroupExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: RadioGroupDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "radio-group-test",
        component: RadioGroupTestComponent,
    },
    {
        path: "radio-group-visual-test",
        component: RadioGroupVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiRadioModule,
        NuiCheckboxModule,
        NuiFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        NuiValidationMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BasicRadioGroupExampleComponent,
        DisabledRadioGroupExampleComponent,
        RadioGroupDocsExampleComponent,
        RadioGroupHintsExampleComponent,
        RadioGroupInFormExampleComponent,
        RadioGroupInlineExampleComponent,
        RadioGroupTestComponent,
        RadioGroupVisualTestComponent,
        ValueChangeRadioGroupExampleComponent,
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
export class RadioGroupModule {
}
