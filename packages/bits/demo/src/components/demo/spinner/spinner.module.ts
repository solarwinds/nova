import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiSpinnerModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    SpinnerBasicExampleComponent,
    SpinnerDeterminateExampleComponent,
    SpinnerExampleComponent,
    SpinnerSizesExampleComponent,
    SpinnerTestComponent,
    SpinnerVisualTestComponent,
    SpinnerWithCancelExampleComponent,
    SpinnerWithDelayToggleExampleComponent,
    SpinnerWithTextExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: SpinnerExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "spinner-test",
        component: SpinnerTestComponent,
    },
    {
        path: "spinner-visual-test",
        component: SpinnerVisualTestComponent,
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
        NuiSpinnerModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SpinnerBasicExampleComponent,
        SpinnerDeterminateExampleComponent,
        SpinnerTestComponent,
        SpinnerVisualTestComponent,
        SpinnerExampleComponent,
        SpinnerSizesExampleComponent,
        SpinnerWithCancelExampleComponent,
        SpinnerWithDelayToggleExampleComponent,
        SpinnerWithTextExampleComponent,
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
export class SpinnerModule {}
