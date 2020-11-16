import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiProgressModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    BasicProgressExampleComponent,
    IndeterminateProgressExampleComponent,
    ProgressCompactExampleComponent,
    ProgressExampleComponent,
    ProgressVisualTestComponent,
    ProgressWithHelpTemplateExampleComponent,
    StackedHeaderProgressExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ProgressExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "progress-visual-test",
        component: ProgressVisualTestComponent,
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
        NuiProgressModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BasicProgressExampleComponent,
        IndeterminateProgressExampleComponent,
        ProgressCompactExampleComponent,
        ProgressExampleComponent,
        ProgressVisualTestComponent,
        ProgressWithHelpTemplateExampleComponent,
        StackedHeaderProgressExampleComponent,
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
export class ProgressModule {
}
