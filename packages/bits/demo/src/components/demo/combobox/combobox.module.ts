import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiSelectModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ComboboxAppendToBodyExampleComponent,
    ComboboxBasicExampleComponent,
    ComboboxClearExampleComponent,
    ComboboxCustomTemplateExampleComponent,
    ComboboxDisabledExampleComponent,
    ComboboxDisplayValueExampleComponent,
    ComboboxDocsComponent,
    ComboboxIconExampleComponent,
    ComboboxInlineExampleComponent,
    ComboboxJustifiedExampleComponent,
    ComboboxReactiveFormExampleComponent,
    ComboboxRequiredExampleComponent,
    ComboboxSeparatorsExampleComponent,
    ComboboxTestComponent,
    ComboboxTypeaheadExampleComponent,
    ComboboxVisualTestComponent,
    ComboboxWithRemoveValueExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ComboboxDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.support,
                eolDate: new Date("2020-07-09"),
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "combobox-test",
        component: ComboboxTestComponent,
    },
    {
        path: "combobox-visual-test",
        component: ComboboxVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "basic",
        component: ComboboxBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiSelectModule,
        NuiTextboxModule,
        FormsModule,
        ReactiveFormsModule,
        NuiButtonModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ComboboxBasicExampleComponent,
        ComboboxClearExampleComponent,
        ComboboxCustomTemplateExampleComponent,
        ComboboxDisabledExampleComponent,
        ComboboxDisplayValueExampleComponent,
        ComboboxDocsComponent,
        ComboboxIconExampleComponent,
        ComboboxInlineExampleComponent,
        ComboboxJustifiedExampleComponent,
        ComboboxReactiveFormExampleComponent,
        ComboboxRequiredExampleComponent,
        ComboboxSeparatorsExampleComponent,
        ComboboxTestComponent,
        ComboboxTypeaheadExampleComponent,
        ComboboxVisualTestComponent,
        ComboboxAppendToBodyExampleComponent,
        ComboboxWithRemoveValueExampleComponent,
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
export class ComboboxModule {}
