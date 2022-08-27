import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    SrlcStage,
} from "@nova-ui/bits";

import { CheckboxGroupTestComponent } from "./checkbox-group-test/checkbox-group-test.component";
import {
    CheckboxGroupBasicExampleComponent,
    CheckboxGroupExampleComponent,
    CheckboxGroupInFormExampleComponent,
    CheckboxGroupInlineExampleComponent,
    CheckboxGroupJustifiedExampleComponent,
    CheckboxGroupVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: CheckboxGroupExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "checkbox-group-visual-test",
        component: CheckboxGroupVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "checkbox-group-test",
        component: CheckboxGroupTestComponent,
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
        NuiDocsModule,
        FormsModule,
        ReactiveFormsModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CheckboxGroupExampleComponent,
        CheckboxGroupInlineExampleComponent,
        CheckboxGroupInFormExampleComponent,
        CheckboxGroupBasicExampleComponent,
        CheckboxGroupVisualTestComponent,
        CheckboxGroupJustifiedExampleComponent,
        CheckboxGroupTestComponent,
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
export class CheckboxGroupModule {}
