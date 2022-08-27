import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    SwitchDisableExampleComponent,
    SwitchDocsExampleComponent,
    SwitchSimpleExampleComponent,
    SwitchTestComponent,
    SwitchValueChangeExampleComponent,
    SwitchVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: SwitchDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "switch-test",
        component: SwitchTestComponent,
    },
    {
        path: "switch-visual-test",
        component: SwitchVisualTestComponent,
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
        NuiSwitchModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SwitchDisableExampleComponent,
        SwitchDocsExampleComponent,
        SwitchSimpleExampleComponent,
        SwitchTestComponent,
        SwitchValueChangeExampleComponent,
        SwitchVisualTestComponent,
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
export class SwitchModule {}
