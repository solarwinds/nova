import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiMenuModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ExpanderBasicExampleComponent,
    ExpanderCustomHeaderExampleComponent,
    ExpanderDocsExampleComponent,
    ExpanderHeaderTextExampleComponent,
    ExpanderInitiallyExpandedExampleComponent,
    ExpanderOpenChangeExampleComponent,
    ExpanderTextAndIconExampleComponent,
    ExpanderVisualTestComponent,
    ExpanderWithoutBorderExampleComponent,
    ExpanderTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ExpanderDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "expander-visual-test",
        component: ExpanderVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "expander-test",
        component: ExpanderTestComponent,
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
        NuiExpanderModule,
        NuiMenuModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ExpanderBasicExampleComponent,
        ExpanderCustomHeaderExampleComponent,
        ExpanderDocsExampleComponent,
        ExpanderHeaderTextExampleComponent,
        ExpanderInitiallyExpandedExampleComponent,
        ExpanderTextAndIconExampleComponent,
        ExpanderOpenChangeExampleComponent,
        ExpanderWithoutBorderExampleComponent,
        ExpanderVisualTestComponent,
        ExpanderTestComponent,
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
export class ExpanderModule {}
