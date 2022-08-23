import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    CheckboxBasicExampleComponent,
    CheckboxDisabledExampleComponent,
    CheckboxExampleComponent,
    CheckboxHelpHintExampleComponent,
    CheckboxIndeterminateExampleComponent,
    CheckboxInFormExampleComponent,
    CheckboxLinkExampleComponent,
    CheckboxOutputExampleComponent,
    CheckboxTestComponent,
    CheckboxVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: CheckboxExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "checkbox-visual-test",
        component: CheckboxVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "checkbox-test",
        component: CheckboxTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiButtonModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CheckboxDisabledExampleComponent,
        CheckboxHelpHintExampleComponent,
        CheckboxIndeterminateExampleComponent,
        CheckboxInFormExampleComponent,
        CheckboxOutputExampleComponent,
        CheckboxLinkExampleComponent,
        CheckboxBasicExampleComponent,
        CheckboxExampleComponent,
        CheckboxVisualTestComponent,
        CheckboxTestComponent,
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
export class CheckboxModule {}
