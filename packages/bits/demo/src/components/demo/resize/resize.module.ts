import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiCommonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ResizeBasicExampleComponent,
    ResizeDocsExampleComponent,
    ResizeNestedExampleComponent,
    ResizePercentsExampleComponent,
    ResizeVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ResizeDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "resizer-visual-test",
        component: ResizeVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiCommonModule,
        NuiDocsModule,
        NuiTextboxModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ResizeBasicExampleComponent,
        ResizePercentsExampleComponent,
        ResizeNestedExampleComponent,
        ResizeDocsExampleComponent,
        ResizeVisualTestComponent,
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
export class ResizeModule {}
