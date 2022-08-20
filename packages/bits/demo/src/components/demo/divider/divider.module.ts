import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDividerModule,
    NuiDocsModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    DividerExampleComponent,
    HorizontalDividersExampleComponent,
    VerticalDividersExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: DividerExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.alpha,
            },
        },
    },
];

@NgModule({
    imports: [NuiDividerModule, NuiDocsModule, RouterModule.forChild(routes)],
    declarations: [
        DividerExampleComponent,
        HorizontalDividersExampleComponent,
        VerticalDividersExampleComponent,
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
export class DividerModule {}
