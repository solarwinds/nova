import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiProgressModule,
    NuiSelectModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    SelectBasicExampleComponent,
    SelectCustomTemplateExampleComponent,
    SelectDisabledExampleComponent,
    SelectDocsComponent,
    SelectInlineExampleComponent,
    SelectJustifiedExampleComponent,
    SelectReactiveFormExampleComponent,
    SelectRemoveValueExampleComponent,
    SelectRequiredExampleComponent,
    SelectSeparatorsExampleComponent,
    SelectVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: SelectDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.support,
                eolDate: new Date("2020-07-09"),
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: SelectBasicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "select-visual-test",
        component: SelectVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "select-reactive-form",
        component: SelectReactiveFormExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiIconModule,
        NuiProgressModule,
        NuiSelectModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SelectBasicExampleComponent,
        SelectCustomTemplateExampleComponent,
        SelectDisabledExampleComponent,
        SelectDocsComponent,
        SelectInlineExampleComponent,
        SelectJustifiedExampleComponent,
        SelectReactiveFormExampleComponent,
        SelectRequiredExampleComponent,
        SelectSeparatorsExampleComponent,
        SelectVisualTestComponent,
        SelectRemoveValueExampleComponent,
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
export class SelectModule {}
