import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    TextboxAreaExampleComponent,
    TextboxBasicExampleComponent,
    TextboxCustomBoxWidthExampleComponent,
    TextboxDisabledExampleComponent,
    TextboxDocsExampleComponent,
    TextboxGettingValueExampleComponent,
    TextboxHintExampleComponent,
    TextboxInfoExampleComponent,
    TextboxNumberBasicExampleComponent,
    TextboxNumberDocsExampleComponent,
    TextboxNumberMinMaxExampleComponent,
    TextboxNumberTestComponent,
    TextboxNumberVisualTestComponent,
    TextboxPlaceholderExampleComponent,
    TextboxReadonlyExampleComponent,
    TextboxRequiredExampleComponent,
    TextboxVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TextboxDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "textbox-number",
        component: TextboxNumberDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "textbox-visual-test",
        component: TextboxVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "textbox-number-test",
        component: TextboxNumberTestComponent,
    },
    {
        path: "textbox-number-visual-test",
        component: TextboxNumberVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiTextboxModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TextboxAreaExampleComponent,
        TextboxCustomBoxWidthExampleComponent,
        TextboxDocsExampleComponent,
        TextboxDisabledExampleComponent,
        TextboxHintExampleComponent,
        TextboxInfoExampleComponent,
        TextboxNumberDocsExampleComponent,
        TextboxNumberMinMaxExampleComponent,
        TextboxNumberBasicExampleComponent,
        TextboxNumberTestComponent,
        TextboxPlaceholderExampleComponent,
        TextboxBasicExampleComponent,
        TextboxRequiredExampleComponent,
        TextboxReadonlyExampleComponent,
        TextboxVisualTestComponent,
        TextboxNumberVisualTestComponent,
        TextboxGettingValueExampleComponent,
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
export class TextboxModule {
}
