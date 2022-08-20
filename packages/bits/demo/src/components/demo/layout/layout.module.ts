import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiLayoutModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    LayoutBasicExampleComponent,
    LayoutComplexExampleComponent,
    LayoutExampleComponent,
    LayoutFitContentComponent,
    LayoutInitSizeExampleComponent,
    LayoutPageContentExampleComponent,
    LayoutResizeExampleComponent,
    LayoutSeparateSheetsExampleComponent,
    LayoutTestComponent,
    LayoutVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: LayoutExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "layout-test",
        component: LayoutTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "layout-visual-test",
        component: LayoutVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiLayoutModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        LayoutExampleComponent,
        LayoutBasicExampleComponent,
        LayoutSeparateSheetsExampleComponent,
        LayoutFitContentComponent,
        LayoutResizeExampleComponent,
        LayoutTestComponent,
        LayoutVisualTestComponent,
        LayoutComplexExampleComponent,
        LayoutInitSizeExampleComponent,
        LayoutPageContentExampleComponent,
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
export class LayoutModule {}
